import z from "zod";

export const emailValidation = z.preprocess(
  (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
  z.email({ error: "Invalid email format" })
);

export type Email = z.infer<typeof emailValidation>;
