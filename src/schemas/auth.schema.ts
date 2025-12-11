import z from "zod";

export const emailValidation = z.preprocess(
  (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
  z.email({ error: "Invalid email format" })
);

export const usernameValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Username is required."
        : "Username must be a string.",
  })
  .min(3, { error: "Username must be at least 3 characters" })
  .max(50, { error: "Username must be at most 50 characters." })
  .regex(/^[\p{L}][\p{L}' -]*$/u, {
    error: "Username contains invalid characters.",
  });

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
};

export type Email = z.infer<typeof emailValidation>;
export type RegisterInput = z.infer<typeof authSchema.register>;
