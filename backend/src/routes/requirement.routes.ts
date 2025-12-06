import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { getRequirements, getRequirementById, createRequirement, updateRequirement, deleteRequirement, classifyRequirement, bulkUpdate } from "../controllers/requirement.controller";

const router = Router();

router.get("/", authenticateToken, getRequirements);
router.get("/:id", authenticateToken, getRequirementById);
router.post("/", authenticateToken, createRequirement);
router.put("/:id", authenticateToken, updateRequirement);
router.delete("/:id", authenticateToken, deleteRequirement);
router.post("/:id/classify", authenticateToken, classifyRequirement);
router.put("/bulk", authenticateToken, bulkUpdate);

export const requirementRouter = router;
