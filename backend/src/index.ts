import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./lib/env";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

app.get("/api", (_req, res) => {
  res.json({ name: "ReqNexa AI API", version: "0.1.0" });
});

const port = env.PORT;
app.listen(port, () => {
  console.log(`ReqNexa API listening on http://localhost:${port}`);
});
