import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./lib/env";
import { authRouter } from "./routes/auth.routes";
import { healthRouter } from "./routes/health";
import { projectsRouter } from "./routes/projects.routes";
import { chatRouter } from "./routes/chat.routes";
import { requirementRouter } from "./routes/requirement.routes";
import { documentRouter } from "./routes/document.routes";

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/chat", chatRouter);
  app.use("/api/requirements", requirementRouter);
  app.use("/api/documents", documentRouter);

  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Not Found" });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ error: message });
  });

  return app;
}
