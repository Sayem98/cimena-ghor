import { UserCtx } from "./types";
import { AppAbility } from "./app/authz/ability";

/**
 * We must export *something* for this file to be treated as a module.
 * We can export an empty object to satisfy this requirement.
 */
export {};

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/consistent-type-definitions
    export interface Request {
      /**
       * Add whatever type you want for your "user".
       * Here, we're using IUserDoc from your Mongoose model.
       */
      user?: UserCtx;
      ability?: AppAbility;
      casl?: { [model: string]: any };
    }
  }
}
