import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkProjectAccess } from "../middleware/project.middleware";
import { generateDocument, listDocuments, downloadDocument, deleteDocument } from "../controllers/document.controller";

const router = Router();

router.post("/generate", authenticateToken, generateDocument);
router.get("/:project_id/list", authenticateToken, checkProjectAccess, listDocuments);
router.get("/:document_id/download", authenticateToken, downloadDocument);
router.delete("/:document_id", authenticateToken, deleteDocument);

export const documentRouter = router;
