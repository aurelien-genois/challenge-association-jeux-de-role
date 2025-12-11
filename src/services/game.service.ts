// The service encapsulates database logic. It’s injected into the controller.
import { PrismaClient } from "../../prisma/generated/prisma/client";
import { type GameCreateOrUpdateInput } from "../schemas/game.schema";

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

  async getCampaignsByGameId(id: number) {
    return this.prisma.campaign.findMany({ where: { game_id: id } });
  }

  async getCharacteristicsByGameId(id: number) {
    return this.prisma.gameHasCharacteristic.findMany({
      where: { game_id: id },
      include: { characteristic: true },
    });
  }

  async create(data: GameCreateOrUpdateInput) {
    return this.prisma.game.create({ data });
  }

  async update(id: number, data: GameCreateOrUpdateInput) {
    return this.prisma.game.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.game.delete({ where: { id } });
  }
}
