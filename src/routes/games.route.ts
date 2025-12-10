import { Router } from "express";
import { prisma } from "../../prisma/client";
import { GameService } from "../services/game.service";
import { GamesController } from "../controllers/games.controller";
import { checkRoles } from "../middlewares/checkRoles.middleware";

export const router = Router();
const gameService = new GameService(prisma);
const gamesController = new GamesController(gameService);

// .bind() is important so "this" in the class method refer to the instance
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

router.get(
  "/:id/campaigns",
  checkRoles(["admin"]),
  gamesController.getAllOneGameCampaigns.bind(gamesController)
);
router.get(
  "/:id/characteristics",
  checkRoles(["admin"]),
  gamesController.getAllOneGameCharacteristics.bind(gamesController)
);

router.post(
  "/",
  checkRoles(["admin"]),
  gamesController.create.bind(gamesController)
);
router.patch(
  "/:id",
  checkRoles(["admin"]),
  gamesController.update.bind(gamesController)
);
router.delete(
  "/:id",
  checkRoles(["admin"]),
  gamesController.delete.bind(gamesController)
);

export default router;
