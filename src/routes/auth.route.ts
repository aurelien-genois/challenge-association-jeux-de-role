import { Router } from "express";
import { prisma } from "../../prisma/client";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
// import { checkRoles } from "../middlewares/checkRoles.middleware";

const router = Router();
const authService = new AuthService(prisma);
const authController = new AuthController(authService);

router.post("/register", authController.register.bind(authController));

export default router;
