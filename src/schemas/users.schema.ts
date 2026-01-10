import z from "zod";

export const usernameValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Username is required."
        : "Username must be a string.",
  })
  .min(3, { error: "Username must be at least 3 characters" })
  .max(12, { error: "Username must be at most 50 characters." })
  .regex(/^[\p{L}][\p{L}' -]*$/u, {
    error: "Username contains invalid characters.",
  });

export const emailValidation = z.preprocess(
  (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
  z.email({ error: "Invalid email format" })
);

export const userSchema = {
  update: z.object({
    name: usernameValidation.optional(),
    email: emailValidation.optional(),
    is_active: z.boolean().optional(),
    role: z.enum(["admin", "member"]).optional(),
  }),
};

export type Email = z.infer<typeof emailValidation>;
export type UserNameValidation = z.infer<typeof usernameValidation>;
export type UpdateUserInput = z.infer<typeof userSchema.update>;
