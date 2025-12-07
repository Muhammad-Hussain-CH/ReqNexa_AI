import { Request, Response, NextFunction } from "express";

export function checkAdminRole(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.role || req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  next();
}

