import { Router } from "express";
import { prisma } from "../../prisma/client";
import { GameService } from "../services/game.service";
import { GamesController } from "../controllers/games.controller";
import { checkRoles } from "../middlewares/checkRoles.middleware";

export const router = Router();
const gameService = new GameService(prisma);
const gamesController = new GamesController(gameService);

router.get(
  "/",
  checkRoles(["admin"]),
  gamesController.getAll.bind(gamesController)
);
router.get(
  "/:id",
  checkRoles(["admin"]),
  gamesController.getById.bind(gamesController)
);

export default router;
