import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability";
import { subject } from "@casl/ability";

import { Action } from "../actions";
import type { Subjects } from "../subjects";
import { userRules } from "./rules/user";
import type { UserCtx } from "../../types";

export type AppAbility = MongoAbility<[Action, Subjects], any>;

export type RuleContributor = (args: {
  can: AbilityBuilder<AppAbility>["can"];
  cannot: AbilityBuilder<AppAbility>["cannot"];
  user: UserCtx;
}) => void;

const contributors = Object.freeze<RuleContributor[]>([userRules]);

export function defineAbilityFor(user?: UserCtx | null) {
  const u: UserCtx = user ?? { id: "anon", role: "user", level: 0 };
  const builder = new AbilityBuilder<AppAbility>(createMongoAbility);
  const { can, cannot, build } = builder;

  if (u.role === "superAdmin") can(Action.Manage, "all");
  for (const contribute of contributors) contribute({ can, cannot, user: u });

  return build({
    detectSubjectType: (obj: any) =>
      obj?.__caslSubject__ ??
      obj?.constructor?.modelName ??
      obj?.__t ??
      obj?.kind ??
      "all",
  });
}

export const asSubject = <S extends Subjects, T extends object>(
  type: S,
  dto: T,
) => subject<S, T>(type, { __caslSubject__: type, ...dto });

// ability/index.ts
export type SubjectInput = Parameters<AppAbility["can"]>[1];
