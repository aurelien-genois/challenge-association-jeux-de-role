// The controller handle HTTP
import type { Request, Response } from "express";
import { GameService } from "../services/game.service";
import { gameSchemas } from "../schemas/game.schema";
import z, { ZodError } from "zod";

export class GamesController {
  constructor(private gameService: GameService) {}

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }

      const game = await this.gameService.getById(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      return res.json(game);
    } catch (error) {
      console.error("❌ Error fetching game:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const games = await this.gameService.getAll();

      // ? add filters ?

      if (!games) {
        return res.status(404).json({ message: "No games found" });
      }

      return res.json(games);
    } catch (error) {
      console.error("❌ Error fetching games:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req: Request, res: Response) {
    try {
      const { title } = gameSchemas.createOrUpdate.parse(req.body); // Zod validation

      const gameWithSameTitle = await this.gameService.getByTitle(title);
      if (gameWithSameTitle) {
        return res
          .status(409)
          .json({ message: "A game already exist with same name" });
      }

      const createdGame = await this.gameService.create({ title });

      return res.status(201).json(createdGame);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: z.prettifyError(error) });
      }
      console.error("❌ Error creating game:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const game = await this.gameService.getById(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      const { title } = gameSchemas.createOrUpdate.parse(req.body); // Zod validation
      const gameWithSameTitle = await this.gameService.getByTitle(title);
      if (gameWithSameTitle) {
        return res
          .status(409)
          .json({ message: "A game already exist with same name" });
      }

      const gameUpdatedId = await this.gameService.update(id, { title });

      return res.status(200).json(gameUpdatedId);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: z.prettifyError(error) });
      }
      console.error("❌ Error updating game:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const game = await this.gameService.getById(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      await this.gameService.delete(id);
      return res.status(204).json();
    } catch (error) {
      console.error("❌ Error deleting game:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getGameCampaigns(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }

      const game = await this.gameService.getById(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      const campaigns = await this.gameService.getCampaignsByGameId(id);
      return res.status(200).json(campaigns);
    } catch (error) {
      console.error("❌ Error fetching game campaigns:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getGameCharacteristics(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }

      const game = await this.gameService.getById(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      const characteristics = await this.gameService.getCharacteristicsByGameId(
        id
      );
      return res.status(200).json(characteristics);
    } catch (error) {
      console.error("❌ Error fetching one game characteristics:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
