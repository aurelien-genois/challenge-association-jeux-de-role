import type { Role } from "../../prisma/generated/prisma/client";
import type { Request, Response, NextFunction } from "express";

// add userId/userRole to Express/Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: Role;
    }
  }
}

export function checkRoles(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO get current user id & role from Access Token
    const role = "admin";
    const userId = 1;
    if (!roles.includes(role)) {
      // if provided role doesn't exist
      return res.status(403).json({ message: "Vous n'avez pas accès" });
    }
    req.userId = userId;
    req.userRole = role;
    next();
  };
}
