import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./lib/env";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth.routes";

const app = express();

app.use(helmet());
const origins = env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);
const corsConfig = {
  origin: origins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
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
