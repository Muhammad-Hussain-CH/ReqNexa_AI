import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkAdminRole } from "../middleware/admin.middleware";
import { listUsers, updateUserRole, updateUserStatus, getAnalytics, listActivity, getSystemHealthStatus } from "../controllers/admin.controller";

const router = Router();

router.use(authenticateToken, checkAdminRole);

router.get("/users", listUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/status", updateUserStatus);
router.get("/analytics", getAnalytics);
router.get("/activity", listActivity);
router.get("/system/health", getSystemHealthStatus);

export const adminRouter = router;

