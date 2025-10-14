import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { setupApiRoutes } from "./routes";
import { logger, morganMiddleware } from "./utils/logger";
import globalErrorHandler from "./middlewere/globalErrorHandler";
import { envs } from "./config";
import cors from "cors";
import { AppError } from "./utils/appError";

const nodeEnv = envs.node_env || "development";

const app: Express = express();

if (nodeEnv === "production") {
  // Production: Use the file/Winston-piped logger (from the file above)

  app.use(morganMiddleware);
  logger.info(
    "Running in Production mode. Logs are going to access.log and console.",
  );
} else {
  // Development (Default): Use the color-coded 'dev' format
  // This is the simplest way to handle development logs
  app.use(morgan("dev"));
  console.log('Running in Development mode. Using "dev" console output.');
}

// cors
const devAllowlist = ["http://localhost:3000", "http://localhost:5173"];
const prodAllowlist = ["https://cinema-ghor.vercel.app"];
const allowlist = nodeEnv === "production" ? prodAllowlist : devAllowlist;

app.use(
  cors({
    origin: function (origin, callback): void {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return void callback(null, true);
      if (allowlist.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return void callback(new Error(msg), false);
      }
      return void callback(null, true);
    },
  }),
);

setupApiRoutes(app);

// 404 CATCH-ALL: This handles any request that fell through the routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export { app };
