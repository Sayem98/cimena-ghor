import { app } from "./app";
import { envs } from "./config";

const server = app.listen(envs.port, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${envs.port}`,
  );
});

process.on("unhandledRejection", () => {
  console.log("unhandledRejection detected, shutting down...");
  server?.close(() => process.exit(1));
});

process.on("uncaughtException", () => {
  console.log("uncaughtException detected, shutting down...");
  process.exit(1);
});
