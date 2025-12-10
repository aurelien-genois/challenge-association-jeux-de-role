// The service encapsulates database logic. It’s injected into the controller.
import { PrismaClient } from "../../prisma/generated/prisma/client";

export class GameService {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.game.findMany();
  }

  async getGameById(id: number) {
    return this.prisma.game.findUnique({ where: { id } });
  }
}
