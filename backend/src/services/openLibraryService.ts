import { Book } from "../types/book.js";

interface OpenLibraryBook {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

interface OpenLibraryResponse {
  docs: OpenLibraryBook[];
}

export async function searchBooks(query: string): Promise<Book[]> {
  const params = new URLSearchParams({
    q: query,
    fields: "key,title,author_name,first_publish_year,cover_i",
    limit: "10",
  });

  const url = `https://openlibrary.org/search.json?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Open Library API returned ${response.status}: ${response.statusText}`
    );
  }

  const data: OpenLibraryResponse = await response.json();

  return data.docs.map((book) => ({
    id: book.key,
    title: book.title ?? "Unknown title",
    authors: book.author_name ?? [],
    publishedDate: book.first_publish_year?.toString(),
    thumbnail: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : undefined,
  }));
}