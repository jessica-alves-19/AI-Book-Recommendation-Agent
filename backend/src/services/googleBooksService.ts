import { Book } from "../types/book.js";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchBooks(query: string): Promise<Book[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&maxResults=10`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Google Books request - attempt ${attempt}`);

      const response = await fetch(url);

      console.log(
        `Google Books status: ${response.status} ${response.statusText}`
      );

      if (response.status === 429) {
        if (attempt === MAX_RETRIES) {
          throw new Error("Google Books API rate limit exceeded");
        }

        console.log(
          `Rate limit reached. Retrying in ${RETRY_DELAY / 1000} seconds...`
        );

        await wait(RETRY_DELAY);

        continue;
      }

      if (!response.ok) {
        throw new Error(
          `Google Books API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      return (data.items ?? []).map((item: any) => ({
        id: item.id,
        title: item.volumeInfo?.title ?? "Unknown title",
        authors: item.volumeInfo?.authors ?? [],
        description: item.volumeInfo?.description,
        publishedDate: item.volumeInfo?.publishedDate,
        pageCount: item.volumeInfo?.pageCount,
        categories: item.volumeInfo?.categories,
        thumbnail: item.volumeInfo?.imageLinks?.thumbnail,
      }));
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        throw error;
      }

      console.error(`Request failed on attempt ${attempt}:`, error);

      await wait(RETRY_DELAY);
    }
  }

  throw new Error("Failed to fetch books from Google Books API");
}