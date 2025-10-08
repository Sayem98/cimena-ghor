import express from "express";
import { setupApiRoutes } from "./routes";

const app = express();

setupApiRoutes(app);

export { app };
