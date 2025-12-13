import { Router } from "express";
import { prisma } from "../../prisma/client";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { AuthController } from "../controllers/auth.controller";
// import { checkRoles } from "../middlewares/checkRoles.middleware";

const router = Router();
const userService = new UserService(prisma);
const authService = new AuthService(userService, prisma);
const authController = new AuthController(authService);

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

export default router;
