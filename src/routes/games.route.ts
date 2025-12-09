import { Router } from "express";
import { gamesController } from "../controllers/games.controller";
import { checkRoles } from "../middlewares/checkRoles.middleware";

export const router = Router();

router.get("/", checkRoles(["admin"]), gamesController.getAll);

export default router;
