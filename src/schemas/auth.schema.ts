import z from "zod";
import { emailValidation, usernameValidation } from "./users.schema.js";

export const passwordValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "Password is required." : "Invalid Password.",
  })
  .min(12, { error: "Password should have minimum length of 12" })
  .max(100, { error: "Password is too long" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    error:
      "Password must include at least 1 special character, 1 uppercase letter, 1 lowercase letter, and 1 number",
  });

export const authSchema = {
  register: z.object({
    email: emailValidation,
    name: usernameValidation,
    password: passwordValidation,
    password_confirmation: passwordValidation,
  }),
  login: z.object({
    email: emailValidation,
    password: passwordValidation,
  }),
  forgotPassword: z.object({
    email: emailValidation,
  }),
  resetPassword: z.object({
    password: passwordValidation,
    password_confirmation: passwordValidation,
  }),
};

export interface Token {
  token: string;
  type: string;
  expiresInMS: number;
}

export type RegisterInput = z.infer<typeof authSchema.register>;
export type LoginInput = z.infer<typeof authSchema.login>;
export type ForgotPasswordInput = z.infer<typeof authSchema.forgotPassword>;
export type ResetPasswordInput = z.infer<typeof authSchema.resetPassword>;
