import { searchBooks } from "../services/googleBooksService.js";

export const searchBooksTool = {
  name: "search_books",
  description: "Search for books using the Google Books API",

  async execute(query: string) {
    return await searchBooks(query);
  },
};
