import express, { Express, Request, Response } from "express";

const router = express.Router();

const getApiRoutes = () => {
  router.get("/health", (req: Request, res: Response) =>
    res.status(200).json({ message: "Active" })
  );

  return router;
};

export const setupApiRoutes = (app: Express): void => {
  app.use("/api/v1", getApiRoutes());
};
