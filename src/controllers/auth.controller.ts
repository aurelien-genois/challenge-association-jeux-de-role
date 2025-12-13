import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { authSchema } from "../schemas/auth.schema";
import z, { ZodError } from "zod";
import type { Token } from "../schemas/auth.schema";
import { config } from "../../server.config";

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
      path: "/auth/refresh",
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
      } else if (error.message === "User already exists") {
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
      } else if (error.message === "Credentials are invalid.") {
        // TODO error class : error instanceof ConflictError
        return res.status(409).json({ message: "The credentials are invalid" });
      }
      console.error("❌ Error on registration:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
