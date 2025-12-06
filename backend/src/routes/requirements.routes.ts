import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, (_req, res) => {
  res.json({ message: "Requirements route placeholder" });
});

export const requirementsRouter = router;
