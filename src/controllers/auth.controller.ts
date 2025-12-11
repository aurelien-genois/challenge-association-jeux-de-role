import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { authSchema } from "../schemas/auth.schema";
import bcrypt from "bcrypt";
import z, { ZodError } from "zod";

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      const { email, name, password, password_confirmation } =
        authSchema.register.parse(req.body); // Zod validation

      const userWithSameEmail = await this.authService.getByEmail(email);
      if (userWithSameEmail) {
        return res
          .status(409)
          .json({ message: "A user already exist with same email" });
      }

      if (password !== password_confirmation) {
        return res
          .status(409)
          .json({ message: "Passwords confirmation failed" });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const userId = await this.authService.create({
        email,
        name,
        password: encryptedPassword,
      });

      if (userId) {
        // TODO send confirmation Email
      }

      return res.status(201).json(userId);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: z.prettifyError(error) });
      }
      console.error("❌ Error on registration:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
