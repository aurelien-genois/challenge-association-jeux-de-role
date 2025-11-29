import "dotenv/config";
export const config = {
  server: {
    port: parseInt(process.env.PORT || "3000"),
    allowedOrigins: process.env.ALLOWED_ORIGINS || "*",
    jwtSecret: process.env.JWT_SECRET || "jwt-secret",
    secure: process.env.NODE_ENV === "production" || false,
    frontUrl: process.env.FRONT_URL || "http://localhost:5173",
    backUrl: process.env.BACK_URL || "http://localhost:3000",
    adminEmail: process.env.ADMIN_EMAIL || "",
    adminPassword: process.env.ADMIN_PASSWORD || "",
  },
};
