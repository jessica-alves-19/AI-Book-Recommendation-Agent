import { searchBooks } from "../services/googleBooksService.js";
import { askAI } from "../services/openaiService.js";

export async function recommendBooks(userQuery: string) {
  // 1. Understand the user's request
  const preferences = await askAI(`
You are a book recommendation assistant.

Analyze this user request:

"${userQuery}"

Extract:
- genre
- author
- similarBook
- minimumPublicationYear
- maximumPages
- language

Return only JSON.
`);

  // 2. Search books
  const books = await searchBooks(userQuery);

  // 3. Ask AI to rank them
  const recommendations = await askAI(`
The user asked:

"${userQuery}"

Here are the books we found:

${JSON.stringify(books)}

Select the best books for the user.

Explain why each recommendation matches their request.
`);

  return recommendations;
}
