import { Router } from "express";
import { prisma } from "../../prisma/client";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { AuthController } from "../controllers/auth.controller";
import { createLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();
const userService = new UserService(prisma);
const authService = new AuthService(userService, prisma);
const authController = new AuthController(authService);

router.post(
  "/register",
  createLimiter(20),
  authController.register.bind(authController)
);
router.post(
  "/login",
  createLimiter(10),
  authController.login.bind(authController)
);
router.get("/logout", authController.logout.bind(authController));
router.post("/refresh", authController.refreshAccessToken.bind(authController));

export default router;
