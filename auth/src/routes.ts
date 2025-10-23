import express, { Express, Request, Response } from "express";

import { router as authRouter } from "./features/auth";

const router = express.Router();

const getApiRoutes = () => {
  router.get("/health", (req: Request, res: Response) =>
    res.status(200).send("Hello from Express + TypeScript!"),
  );
  router.use("/auth", authRouter);

  return router;
};

export const setupApiRoutes = (app: Express): void => {
  app.use("/api/v1", getApiRoutes());
};
