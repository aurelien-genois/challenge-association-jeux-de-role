// The controller handle HTTP
import type { Request, Response } from "express";
import { GameService } from "../services/game.service.js";
import { gameSchemas } from "../schemas/game.schema.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils/errors.js";

export class GamesController {
  constructor(private gameService: GameService) {}

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new BadRequestError("Invalid game ID");
    }

    const game = await this.gameService.getById(id);
    if (!game) {
      throw new NotFoundError("Game not found");
    }

    return res.json(game);
  }

  async getAll(req: Request, res: Response) {
    const games = await this.gameService.getAll();

    // ? add filters ?

    if (!games) {
      throw new NotFoundError("No games found");
    }

    return res.json(games);
  }
  async create(req: Request, res: Response) {
    const { title } = gameSchemas.createOrUpdate.parse(req.body); // Zod validation

    // ? move to userService.setActiveState ?
    const gameWithSameTitle = await this.gameService.getByTitle(title);
    if (gameWithSameTitle) {
      throw new ConflictError("A game already exist with same name");
    }

    const createdGame = await this.gameService.create({ title });

    return res.status(201).json(createdGame);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new BadRequestError("Invalid game ID");
    }

    // ? move to userService.setActiveState ?
    const game = await this.gameService.getById(id);
    if (!game) {
      throw new NotFoundError("Game not found");
    }

    // ? move to userService.setActiveState ?
    const { title } = gameSchemas.createOrUpdate.parse(req.body); // Zod validation
    const gameWithSameTitle = await this.gameService.getByTitle(title);
    if (gameWithSameTitle) {
      throw new ConflictError("A game already exist with same name");
    }

    const gameUpdatedId = await this.gameService.update(id, { title });

    return res.status(200).json(gameUpdatedId);
  }

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new BadRequestError("Invalid game ID");
    }

    // ? move to userService.setActiveState ?
    const game = await this.gameService.getById(id);
    if (!game) {
      throw new NotFoundError("Game not found");
    }

    await this.gameService.delete(id);
    return res.status(204).json();
  }

  async getGameCampaigns(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError("Invalid game ID");
    }

    // ? move to userService.setActiveState ?
    const game = await this.gameService.getById(id);
    if (!game) {
      throw new NotFoundError("Game not found");
    }

    const campaigns = await this.gameService.getCampaignsByGameId(id);
    return res.status(200).json(campaigns);
  }

  async getGameCharacteristics(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError("Invalid game ID");
    }

    // ? move to userService.setActiveState ?
    const game = await this.gameService.getById(id);
    if (!game) {
      throw new NotFoundError("Game not found");
    }

    const characteristics = await this.gameService.getCharacteristicsByGameId(
      id
    );
    return res.status(200).json(characteristics);
  }
}
