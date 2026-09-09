import { z } from "zod";

export const bookPreferencesSchema = z.object({
  genre: z.string().nullable(),
  author: z.string().nullable(),
  similarBook: z.string().nullable(),
  minimumPublicationYear: z.number().nullable(),
  maximumPages: z.number().nullable(),
  language: z.string().nullable(),
});

export type BookPreferences = z.infer<typeof bookPreferencesSchema>;
