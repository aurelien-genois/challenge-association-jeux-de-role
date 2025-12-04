import "dotenv/config";
import { z } from "zod";

const configSchema = z.object({
  PORT: z.string().default("3000"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  ALLOWED_ORIGINS: z.string().default("*"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  FRONT_URL: z.url().default("http://localhost:5173"),
  BACK_URL: z.url().default("http://localhost:3000"),
  ADMIN_EMAIL: z.email().optional(),
  ADMIN_PASSWORD: z.string().optional(),
});

const parsed = configSchema.parse(process.env);

export const config = {
  server: {
    port: parseInt(parsed.PORT),
    jwtSecret: parsed.JWT_SECRET,
    allowedOrigins: parsed.ALLOWED_ORIGINS,
    secure: parsed.NODE_ENV === "production",
    frontUrl: parsed.FRONT_URL,
    backUrl: parsed.BACK_URL,
  },
  admin: {
    adminEmail: parsed.ADMIN_EMAIL,
    adminPassword: parsed.ADMIN_PASSWORD,
  },
};
