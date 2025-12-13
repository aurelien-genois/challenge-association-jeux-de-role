import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "../../server.config.js";
import type { User } from "../../prisma/generated/prisma/client.js";

export function generateAuthenticationTokens(user: User) {
  if (!user.id || !user.role) {
    throw new Error("User authentication failed - invalid user data");
  }

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
