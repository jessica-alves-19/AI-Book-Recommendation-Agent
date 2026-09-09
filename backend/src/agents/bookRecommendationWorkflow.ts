import { searchBooks } from "../services/openLibraryService.js";
import { askAI } from "../services/openaiService.js";
import { bookPreferencesSchema } from "../types/bookPreferences.js";

export async function runBookRecommendationWorkflow(userQuery: string) {
  // Step 1: Understand the request
  const preferencesResponse = await askAI(`
Extract the user's book preferences from this request:

"${userQuery}"

Return ONLY valid JSON containing:

genre,
author,
similarBook,
minimumPublicationYear,
maximumPages,
language.
`);

  const preferencesData = JSON.parse(preferencesResponse);

  const result = bookPreferencesSchema.safeParse(preferencesData);

  if (!result.success) {
    throw new Error("AI returned invalid book preferences");
  }

  const preferences = result.data;

  // Step 2: Search
  const searchQuery = [
    preferences.genre,
    preferences.author,
    preferences.similarBook,
  ]
    .filter(Boolean)
    .join(" ");

  const books = await searchBooks(searchQuery);

  const filteredBooks = books.filter((book) => {
    if (!preferences.minimumPublicationYear) {
      return true;
    }

    if (!book.publishedDate) {
      return false;
    }

    const publicationYear = Number.parseInt(book.publishedDate, 10);

    return publicationYear >= preferences.minimumPublicationYear;
  });

  // Step 3: Rank
  const rankedBooks = await askAI(`
User request:

${userQuery}

User preferences:

${JSON.stringify(preferences)}

Available books:

${JSON.stringify(filteredBooks)}

Choose the best recommendations.

Explain your reasoning.
`);

  return rankedBooks;
}
