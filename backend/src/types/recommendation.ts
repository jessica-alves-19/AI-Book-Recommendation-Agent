import { z } from "zod";

export const BookPreferencesSchema = z.object({
  genre: z.string().nullable(),
  author: z.string().nullable(),
  similarBook: z.string().nullable(),
  publicationYear: z.number().nullable(),
  publishedAfter: z.number().nullable(),
  maxPages: z.number().nullable(),
  language: z.string().nullable(),
});

export type BookPreferences = z.infer<
  typeof BookPreferencesSchema
>;