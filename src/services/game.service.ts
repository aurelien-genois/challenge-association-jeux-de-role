// The service encapsulates database logic. It’s injected into the controller.
import { PrismaClient } from "../../prisma/generated/prisma/client";
import { type GameCreateInput } from "../schemas/game.schema";

export class GameService {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.game.findMany();
  }

  async getById(id: number) {
    return this.prisma.game.findUnique({ where: { id } });
  }

  async getByTitle(title: string) {
    return this.prisma.game.findUnique({ where: { title } });
  }

  async create(data: GameCreateInput) {
    return this.prisma.game.create({ data });
  }
}
