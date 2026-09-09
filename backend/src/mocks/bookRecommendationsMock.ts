import type { Book } from "../types/book.js";

export const mockBookRecommendations: Book[] = [
  {
    id: "mock-1",
    title: "Phantasma",
    authors: ["Kaylie Smith"],
    publishedDate: "2024",
    thumbnail:
      "https://covers.openlibrary.org/b/id/14842920-M.jpg",
  },
  {
    id: "mock-2",
    title: "Feathers So Vicious",
    authors: ["Liv Zander"],
    publishedDate: "2023",
    thumbnail:
      "https://covers.openlibrary.org/b/id/15252953-M.jpg",
  },
  {
    id: "mock-3",
    title: "Enchantra",
    authors: ["Kaylie Smith"],
    publishedDate: "2025",
    thumbnail:
      "https://covers.openlibrary.org/b/id/15115281-M.jpg",
  },
];