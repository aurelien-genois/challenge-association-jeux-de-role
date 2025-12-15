import { PrismaClient } from "../../prisma/generated/prisma/client";
import type { Token, RegisterInput, LoginInput } from "../schemas/auth.schema";
import { UserService } from "./user.service";
import bcrypt from "bcrypt";
import { generateAuthenticationTokens } from "../utils/token";
import type { User } from "../../prisma/generated/prisma/client";
import {
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from "../utils/errors";

export class AuthService {
  constructor(private userService: UserService, private prisma: PrismaClient) {}

  async replaceRefreshTokenInDatabase(token: Token, user: User): Promise<void> {
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
    if (userWithSameEmail) throw new ConflictError("User already exists");

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
    if (!user) throw new UnauthorizedError("User not found");
    if (!user.is_active) throw new UnauthorizedError("Not active user.");

    const isMatching = await bcrypt.compare(data.password, user.password);
    if (!isMatching) throw new UnauthorizedError("Credentials are invalid.");

    const { accessToken, refreshToken } = generateAuthenticationTokens(user);
    await this.replaceRefreshTokenInDatabase(refreshToken, user);

    const { password: _pw, ...safeUser } = user;

    return { safeUser, accessToken, refreshToken };
  }

  async refreshAccessToken(token: string) {
    const existingRefreshToken = await this.prisma.token.findFirst({
      where: { token: token, type: "refresh" },
      include: {
        user: {}, // all user data
      },
    });

    if (
      !existingRefreshToken ||
      !existingRefreshToken.user ||
      !existingRefreshToken.user.role
    ) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    if (
      !existingRefreshToken.expires_at ||
      existingRefreshToken.expires_at < new Date()
    ) {
      if (existingRefreshToken.id) {
        await this.prisma.token.delete({
          where: { id: existingRefreshToken.id },
        });
      }
      throw new ForbiddenError("Expired refresh token");
    }

    const { accessToken, refreshToken } = generateAuthenticationTokens(
      existingRefreshToken.user
    );
    await this.replaceRefreshTokenInDatabase(
      refreshToken,
      existingRefreshToken.user
    );

    const { password: _pw, ...safeUser } = existingRefreshToken.user;

    return { safeUser, accessToken, refreshToken };
  }

  async revokeRefreshToken(token: string) {
    await this.prisma.token.delete({ where: { token, type: "refresh" } });
  }
}
