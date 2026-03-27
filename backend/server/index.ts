import cors from "cors";
import express from "express";

import { checkDbConnection } from "./db";
import { handleDemo } from "./routes/demo";
import { usersRouter } from "./routes/users";
import { authRouter } from "./routes/auth";
import { validateS3Configuration } from "./s3";

export function createServer() {
  const app = express();
  void checkDbConnection();
  void validateS3Configuration();

  app.use(cors());
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.use("/api", authRouter);
  app.use("/api/users", usersRouter);

  return app;
}
