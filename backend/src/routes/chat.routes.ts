import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { startConversation, sendMessage, getConversation, resumeConversation } from "../controllers/chat.controller";

const router = Router();

router.post("/start", authenticateToken, startConversation);
router.post("/message", authenticateToken, sendMessage);
router.get("/:conversation_id", authenticateToken, getConversation);
router.post("/:conversation_id/resume", authenticateToken, resumeConversation);

export const chatRouter = router;
