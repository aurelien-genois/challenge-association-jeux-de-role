import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "../../server.config.js";
import type { User } from "../../prisma/generated/prisma/client.js";
import { UnauthorizedError } from "./errors.js";

export function generateAuthenticationTokens(user: User) {
  if (!(user.id != undefined && user.id >= 0) || !user.role) {
    throw new UnauthorizedError(
      "User authentication failed - invalid user data"
    );
  }

  // "sub" for subject of the JWT
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.server.jwtSecret,
    { expiresIn: "15m" }
  );
  const refreshToken = crypto.randomBytes(128).toString("base64");

  return {
    accessToken: {
      token: accessToken,
      type: "Bearer",
      expiresInMS: 15 * 60 * 1000,
    },
    refreshToken: {
      token: refreshToken,
      type: "Bearer",
      expiresInMS: 7 * 24 * 60 * 60 * 1000,
    },
  };
}
