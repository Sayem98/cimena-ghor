export type UserCtx = {
  id: string;
  role: "superAdmin" | "admin" | "user";
  level?: number;
};
