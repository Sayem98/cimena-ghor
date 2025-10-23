import { app } from "./app";
import { envs } from "./config";
import { connectDB } from "./utils/db";
import { Server } from "http";

let server: Server | undefined;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
connectDB(envs.database_url).then(() => {
  console.log("Database connected successfully");
  server = app.listen(envs.port, () => {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${envs.port}`,
    );
  });
});

process.on("unhandledRejection", () => {
  console.log("unhandledRejection detected, shutting down...");
  server?.close(() => process.exit(1));
});

process.on("uncaughtException", () => {
  console.log("uncaughtException detected, shutting down...");
  process.exit(1);
});
