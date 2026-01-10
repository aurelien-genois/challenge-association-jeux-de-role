import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { authSchema } from "../schemas/auth.schema.js";
import type { Token } from "../schemas/auth.schema.js";
import { config } from "../../server.config.js";
import { BadRequestError, ConflictError } from "../utils/errors.js";

export class AuthController {
  constructor(private authService: AuthService) {}

  setAccessTokenCookie(res: Response, accessToken: Token) {
    res.cookie("accessToken", accessToken.token, {
      httpOnly: true,
      maxAge: accessToken.expiresInMS,
      secure: config.server.secure,
    });
  }

  setRefreshTokenCookie(res: Response, refreshToken: Token) {
    res.cookie("refreshToken", refreshToken.token, {
      httpOnly: true,
      maxAge: refreshToken.expiresInMS,
      secure: config.server.secure,
      // path: "/auth/refresh", would block req.cookies.refreshToken for /auth/logout
    });
  }

  async register(req: Request, res: Response) {
    const { email, name, password, password_confirmation } =
      authSchema.register.parse(req.body); // Zod validation

    if (password !== password_confirmation) {
      throw new ConflictError("Passwords confirmation failed");
    }

    const userId = await this.authService.create({
      email,
      name,
      password,
    });

    return res.status(201).json(userId);
  }

  async login(req: Request, res: Response) {
    const { email, password } = authSchema.login.parse(req.body);

    const { safeUser, accessToken, refreshToken } =
      await this.authService.login({ email, password });

    this.setAccessTokenCookie(res, accessToken);
    this.setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json(safeUser);
  }

  async logout(req: Request, res: Response) {
    console.log(req.cookies);
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await this.authService.revokeRefreshToken(refreshToken); // important to remove a security risk
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken"); // { path: "/auth/refresh" } would block req.cookies.refreshToken for /auth/logout
    res.status(200).json({ message: "Logout successful." });
  }

  async refreshAccessToken(req: Request, res: Response) {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!rawToken) {
      throw new BadRequestError("Refresh token not provided");
    }

    const { accessToken, refreshToken } =
      await this.authService.refreshAccessToken(rawToken);

    this.setAccessTokenCookie(res, accessToken);
    this.setRefreshTokenCookie(res, refreshToken);

    res.json("New access token generated successfully.");
  }
}
