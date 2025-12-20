import { Router } from "express";
import { prisma } from "../../prisma/client.js";
import { UserService } from "../services/user.service.js";
import { UsersController } from "../controllers/users.controller.js";
import { checkRoles } from "../middlewares/checkRoles.middleware.js";

const router = Router();
const userService = new UserService(prisma);
const usersController = new UsersController(userService);

router.get(
  "/me",
  checkRoles(["admin", "member"]),
  usersController.getMyAccount.bind(usersController)
);

router.get(
  "/",
  checkRoles(["admin"]),
  usersController.getAll.bind(usersController)
);

router.get(
  "/:id",
  checkRoles(["admin"]),
  usersController.getbyId.bind(usersController)
);

router.patch(
  "/:id/activate",
  checkRoles(["admin"]),
  usersController.toggleUserActiveState.bind(usersController, true)
);

router.patch(
  "/:id/deactivate",
  checkRoles(["admin"]),
  usersController.toggleUserActiveState.bind(usersController, false)
);

export default router;
