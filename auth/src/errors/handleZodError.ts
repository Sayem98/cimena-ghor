import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGnericErrorResponse } from "../types";

const handleZodError = (error: ZodError): TGnericErrorResponse => {
  const statusCode = 400;

  const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
    // Get the last element of the path array
    const lastPathElement = issue.path[issue.path.length - 1];

    // Ensure the path is a string or number, which are the valid types
    // for a Zod path element (key or index).
    // We use a type assertion or a check to satisfy TErrorSources.
    // If lastPathElement is undefined, we default to a placeholder like 'unknown'.
    const path: string | number =
      typeof lastPathElement === "string" || typeof lastPathElement === "number"
        ? lastPathElement
        : "unknown"; // Default if path is somehow empty or a symbol

    return {
      path: path,
      message: issue.message,
    };
  });

  const message: string =
    "Required " +
    error.issues
      .map((issue) => issue.path.filter((p) => p !== "body").join("."))
      .join(", ");

  return {
    statusCode,
    message: message || "Validation error",
    errorSources,
  };
};

export default handleZodError;
