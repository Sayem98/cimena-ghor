import dotenv from "dotenv";
import { app } from "./app";
dotenv.config({
  path: ".env",
});

import { envs } from "./config";
console.log("Environment:", envs.node_env, envs.port);
console.log(process.env.PORT);

const server = app.listen(envs.port, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${envs.port}`,
  );
});

process.on("unhandledRejection", () => {
  console.log(`unhandleRejection is detected, shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", () => {
  console.log(`uncaughtRejection is detected, shutting down...`);
  process.exit(1);
});
