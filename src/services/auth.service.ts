import { PrismaClient } from "../../prisma/generated/prisma/client";
import type { Email, RegisterInput } from "../schemas/auth.schema";

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async getByEmail(email: Email) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Omit<RegisterInput, "password_confirmation">) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
      },
    });
  }
}
