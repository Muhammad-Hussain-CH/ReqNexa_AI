import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, addTeamMember } from "../controllers/project.controller";
import { validateProjectData, checkProjectAccess, checkProjectOwner } from "../middleware/project.middleware";

const router = Router();

router.post("/", authenticateToken, validateProjectData("create"), createProject);
router.get("/", authenticateToken, getAllProjects);
router.get("/:id", authenticateToken, checkProjectAccess, getProjectById);
router.put("/:id", authenticateToken, checkProjectOwner, validateProjectData("update"), updateProject);
router.delete("/:id", authenticateToken, checkProjectOwner, deleteProject);
router.post("/:id/members", authenticateToken, checkProjectOwner, addTeamMember);

export const projectsRouter = router;
