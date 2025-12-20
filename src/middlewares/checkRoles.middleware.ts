import type { Role } from "../../prisma/generated/prisma/client.js";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { config } from "../../server.config.js";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";

// add userId/userRole to Express/Request interface
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: Role;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

function verifyAndDecodeJWT(accessToken: string): JwtPayload {
  try {
    const payload = jwt.verify(
      accessToken,
      config.server.jwtSecret
    ) as JwtPayload;

    // payload = {sub, email, role, iat, exp} (cf src/utils/token.ts)

    return payload;
  } catch (error) {
    console.error(error);
    throw new ForbiddenError("Invalid or expired access token");
  }
}

function extractAccessToken(req: Request): string {
  if (typeof req.cookies?.accessToken === "string") {
    return req.cookies.accessToken;
  }
  if (typeof req.headers?.authorization === "string") {
    return req.headers.authorization.split(" ")[1]; // if Authorization: `Bearer ${accessToken.token}`
  }
  throw new UnauthorizedError("Access Token not provided");
}

export function checkRoles(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractAccessToken(req);
    const { sub: userId, role } = verifyAndDecodeJWT(token);
    if (!roles.includes(role)) {
      // if provided role doesn't exist
      return res.status(403).json({ message: "Vous n'avez pas accès" });
    }
    req.userId = Number(userId);
    req.userRole = role;
    next();
  };
}
