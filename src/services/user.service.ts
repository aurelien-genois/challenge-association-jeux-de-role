import { PrismaClient } from "../../prisma/generated/prisma/client";
import type { Email } from "../schemas/users.schema";

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async getByEmail(email: Email) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
