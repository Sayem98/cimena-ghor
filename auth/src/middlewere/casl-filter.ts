// authz/casl-filter.ts
import type { Request, Response, NextFunction } from "express";
import { accessibleBy } from "@casl/mongoose";
import type { AppAbility } from "../authz/ability";
import { Action } from "../authz/actions";
import { Subjects } from "../authz/subjects";

export function withCaslFilter(modelName: Subjects, action: Action) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const ability = req.ability as AppAbility;
    const where = accessibleBy(ability, action).ofType(modelName);
    req.casl ??= {};
    req.casl[modelName] = where;
    next();
  };
}
