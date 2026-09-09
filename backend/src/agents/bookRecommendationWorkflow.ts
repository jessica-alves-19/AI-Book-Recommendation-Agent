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

  const cleanedPreferencesResponse = preferencesResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const preferencesData = JSON.parse(cleanedPreferencesResponse);

  const result = bookPreferencesSchema.safeParse(preferencesData);

  if (!result.success) {
    throw new Error("AI returned invalid book preferences");
  }

  const preferences = result.data;

  // Step 2: Search
  const searchQuery = preferences.genre ?? "";

  const books = await searchBooks(searchQuery);
  console.log("SEARCH QUERY:", searchQuery);
  console.log("BOOKS FOUND:", books);

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
    const rankedBooksResponse = await askAI(`
You are a book recommendation assistant.

User request:
${userQuery}

User preferences:
${JSON.stringify(preferences)}

Available books:
${JSON.stringify(filteredBooks)}

Choose the best books from the available books.

Return ONLY a valid JSON array containing the IDs of the recommended books.

Example:
["/works/OL123W", "/works/OL456W"]

Only use IDs that exist in the Available books list.
Do not include explanations.
Do not include markdown.
`);

  console.log("AI RANKING RESPONSE:", rankedBooksResponse);

  const recommendedIds = JSON.parse(rankedBooksResponse);
  console.log("RECOMMENDED IDS:", recommendedIds);
  console.log("FILTERED BOOKS:", filteredBooks);

  const recommendations = filteredBooks.filter((book) =>
    recommendedIds.includes(book.id),
  );
  console.log("FINAL RECOMMENDATIONS:", recommendations);

  return recommendations;
}
