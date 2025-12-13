import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { authSchema } from "../schemas/auth.schema";
import z, { ZodError } from "zod";

export class AuthController {
  constructor(private authService: AuthService) {}

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

      const safeUser = await this.authService.login({ email, password });

      return res.status(200).json(safeUser);
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
}
