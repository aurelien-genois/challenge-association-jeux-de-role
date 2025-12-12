import { PrismaClient } from "../../prisma/generated/prisma/client";
import type { RegisterInput } from "../schemas/auth.schema";
import { UserService } from "./user.service";
import bcrypt from "bcrypt";

export class AuthService {
  constructor(private userService: UserService, private prisma: PrismaClient) {}

  async create(data: Omit<RegisterInput, "password_confirmation">) {
    const userWithSameEmail = await this.userService.getByEmail(data.email);
    if (userWithSameEmail) throw new Error("User already exists");

    const encryptedPassword = await bcrypt.hash(data.password, 10);

    const user = this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: encryptedPassword,
      },
      select: {
        id: true,
      },
    });

    // TODO send confirmation Email (via EmailService)

    return user;
  }
}
