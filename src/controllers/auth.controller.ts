import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { authSchema } from "../schemas/auth.schema";
import z, { ZodError } from "zod";
import type { Token } from "../schemas/auth.schema";
import { config } from "../../server.config";
import { BadRequestError, HttpClientError } from "../utils/errors";

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
    try {
      const { email, name, password, password_confirmation } =
        authSchema.register.parse(req.body); // Zod validation

      if (password !== password_confirmation) {
        return res
          .status(409)
          .json({ message: "Passwords confirmation failed" });
      }

      const userId = await this.authService.create({
        email,
        name,
        password,
      });

      return res.status(201).json(userId);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: z.prettifyError(error) });
      } else if (error instanceof HttpClientError) {
        // TODO error class : error instanceof ConflictError
        return res
          .status(409)
          .json({ message: "A user already exists with same email" });
      }
      console.error("❌ Error on registration:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = authSchema.login.parse(req.body);

      const { safeUser, accessToken, refreshToken } =
        await this.authService.login({ email, password });

      this.setAccessTokenCookie(res, accessToken);
      this.setRefreshTokenCookie(res, refreshToken);

      return res.status(200).json(safeUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: z.prettifyError(error) });
      } else if (error instanceof HttpClientError) {
        // TODO error class : error instanceof ConflictError
        return res.status(409).json({ message: "The credentials are invalid" });
      }
      console.error("❌ Error on login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      console.log(req.cookies);
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await this.authService.revokeRefreshToken(refreshToken); // important to remove a security risk
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken"); // { path: "/auth/refresh" } would block req.cookies.refreshToken for /auth/logout
      res.status(200).json({ message: "Logout successful." });
    } catch (error) {
      console.error("❌ Error on logout:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async refreshAccessToken(req: Request, res: Response) {
    try {
      const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!rawToken) {
        throw new BadRequestError("Refresh token not provided");
      }

      const { accessToken, refreshToken } =
        await this.authService.refreshAccessToken(rawToken);

      this.setAccessTokenCookie(res, accessToken);
      this.setRefreshTokenCookie(res, refreshToken);

      res.json("New access token generated successfully.");
    } catch (error) {
      console.error("❌ Error on refresh access token:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
