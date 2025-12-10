import { z } from "zod";

const gameTitleValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "Title is required" : "Title must be a string",
  })
  .min(3, "Title must have at least 3 characters")
  .max(50, "Title must have at most 50 characters");

export const gameSchemas = {
  create: z.object({
    title: gameTitleValidation,
  }),
};

export type GameCreateInput = z.infer<typeof gameSchemas.create>;
