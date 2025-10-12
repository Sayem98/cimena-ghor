/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Request, Response, NextFunction } from "express";
import { defineAbilityFor } from "../authz/ability";
import type { AppAbility } from "../authz/ability";
import type { UserCtx } from "../types";

export const attachAbility = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // You must be CERTAIN that req.user exists before this middleware runs.
  // This typically means placing it AFTER your authentication middleware.

  // Using a type guard for safety (best practice):
  if (!req.user) {
    // Handle unauthenticated request (e.g., return 401 or call next(error))
    return void next(new Error("Authentication required."));
  }

  // Define the ability based on the user context
  const userCtx: UserCtx = {
    // Now req.user is correctly typed as AuthUser, so no unsafe assignment!

    id: req.user.id,
    role: req.user.role,
    level: req.user.level || 0,
  };

  // Now req.ability is also typed correctly by your express.d.ts
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  req.ability = defineAbilityFor(userCtx) as AppAbility;

  next();
};
