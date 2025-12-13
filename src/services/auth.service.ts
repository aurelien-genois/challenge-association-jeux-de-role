import { PrismaClient } from "../../prisma/generated/prisma/client";
import type { Token, RegisterInput, LoginInput } from "../schemas/auth.schema";
import { UserService } from "./user.service";
import bcrypt from "bcrypt";
import { generateAuthenticationTokens } from "../utils/token";
import type { User } from "../../prisma/generated/prisma/client";

export class AuthService {
  constructor(private userService: UserService, private prisma: PrismaClient) {}

  async replaceRefreshTokenInDatabase(token: Token, user: User) {
    await this.prisma.token.deleteMany({
      where: { user_id: user.id, type: "refresh" },
    });
    await this.prisma.token.create({
      data: {
        token: token.token,
        type: "refresh",
        user_id: user.id,
        expires_at: new Date(Date.now() + token.expiresInMS),
      },
    });
  }

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

  async login(data: LoginInput) {
    const user = await this.userService.getByEmail(data.email);
    if (!user) throw new Error("User not found");
    if (!user.is_active) throw new Error("This account is not active.");

    const isMatching = await bcrypt.compare(data.password, user.password);
    if (!isMatching) throw new Error("Credentials are invalid.");

    const { accessToken, refreshToken } = generateAuthenticationTokens(user);
    await this.replaceRefreshTokenInDatabase(refreshToken, user);

    const { password: _pw, ...safeUser } = user;

    return { safeUser, accessToken, refreshToken };
  }
}
