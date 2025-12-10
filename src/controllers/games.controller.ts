// The controller handle HTTP
import type { Request, Response } from "express";
import { GameService } from "../services/game.service";
import { gameSchemas } from "../schemas/game.schema";
import { ZodError } from "zod";

export class GamesController {
  constructor(private gameService: GameService) {}

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const game = await this.gameService.getById(id);

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
  async create(req: Request, res: Response) {
    try {
      const { title } = gameSchemas.create.parse(req.body); // Zod validation

      const gameWithSameTitle = await this.gameService.getByTitle(title);
      if (gameWithSameTitle) {
        return res
          .status(409)
          .json({ message: "A game already exist with same name" });
      }

      const createdGame = await this.gameService.create({ title });

      res.status(201).json(createdGame);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.message });
      }
      console.error("❌ Unexpected error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {}

  async delete(req: Request, res: Response) {}

  async getAllOneGameCampaigns(req: Request, res: Response) {}

  async getAllOneGameCharacteristics(req: Request, res: Response) {}
}
