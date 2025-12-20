import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import type { Email } from "../schemas/users.schema.js";

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
      },
    });
  }

  async getByEmail(email: Email) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
      },
    });
  }

  async setActiveState(id: number, isActive: boolean) {
    const user = this.prisma.user.update({
      where: { id },
      data: { is_active: isActive },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
      },
    });

    // TODO send activation/deactivation Email (via EmailService) with isActive param

    return user;
  }
}
