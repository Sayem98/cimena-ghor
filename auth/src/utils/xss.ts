/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { Request, Response, NextFunction, RequestHandler } from "express";
import xssFilters from "xss-filters";
// Recommended (maintained) alternative: `import xss from "xss";`
// then replace `xssFilters.inHTMLData(str)` with `xss(str)`.

// eslint-disable-next-line @typescript-eslint/naming-convention
const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function sanitizeValue(v: unknown): unknown {
  if (typeof v === "string") {
    // encode potentially dangerous characters for HTML contexts
    return xssFilters.inHTMLData(v);
    // If you switch to `xss` library: return xss(v);
  }
  if (Array.isArray(v)) {
    for (let i = 0; i < v.length; i++) v[i] = sanitizeValue(v[i]);
    return v;
  }
  // Ignore null, dates, buffers, etc.
  if (!v || typeof v !== "object") return v;
  if (
    v instanceof Date ||
    (typeof Buffer !== "undefined" && Buffer.isBuffer(v))
  )
    return v;

  // Plain object (including Express's ParsedQs). Mutate in place.
  for (const key of Object.keys(v as Record<string, unknown>)) {
    if (DANGEROUS_KEYS.has(key)) {
      // prevent prototype pollution
      delete (v as Record<string, unknown>)[key];
      continue;
    }
    const current = (v as Record<string, unknown>)[key];
    (v as Record<string, unknown>)[key] = sanitizeValue(current);
  }
  return v;
}

export const xssSanitizer: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (req.body) sanitizeValue(req.body); // do not reassign: keep original object
    if (req.query) sanitizeValue(req.query as any);
    if (req.params) sanitizeValue(req.params as any);
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // If anything goes sideways, don’t 500 the health check:
    // just skip sanitization for this request.
    // You can also log the error with your logger here.
    next();
  }
};
