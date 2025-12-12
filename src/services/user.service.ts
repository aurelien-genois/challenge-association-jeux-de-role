import { PrismaClient } from "../../prisma/generated/prisma/client";
import type { Email } from "../schemas/users.schema";

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async getByEmail(email: Email) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async setActiveState(id: number, isActive: boolean) {
    const user = this.prisma.user.update({
      where: { id },
      data: { is_active: isActive },
    });

    // TODO send activation/deactivation Email (via EmailService) with isActive param

    return user;
  }
}
