// The controller handle HTTP
import type { Request, Response } from "express";
import { GameService } from "../services/game.service";

export class GamesController {
  constructor(private gameService: GameService) {}

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const game = await this.gameService.getGameById(id);

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      res.json(game);
    } catch (error) {
      console.error("❌ Error fetching game:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const games = await this.gameService.getAll();

      if (!games) {
        return res.status(404).json({ message: "Game not found" });
      }

      res.json(games);
    } catch (error) {
      console.error("❌ Error fetching games:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
