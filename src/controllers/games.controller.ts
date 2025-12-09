import type { Request, Response } from "express";
import { prisma } from "../../prisma/client";

// ? class rather than object
export const gamesController = {
  async getAll(req: Request, res: Response) {
    const games = await prisma.game.findMany();

    res.status(200).json(games);
  },
};
