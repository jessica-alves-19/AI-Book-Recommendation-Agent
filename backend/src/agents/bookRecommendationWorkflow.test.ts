import { beforeEach, describe, expect, it, vi } from "vitest";

import { runBookRecommendationWorkflow } from "./bookRecommendationWorkflow.js";
import { askAI } from "../services/openaiService.js";
import { searchBooks } from "../services/openLibraryService.js";

vi.mock("../services/openaiService.js", () => ({
  askAI: vi.fn(),
}));

vi.mock("../services/openLibraryService.js", () => ({
  searchBooks: vi.fn(),
}));

const mockedAskAI = vi.mocked(askAI);
const mockedSearchBooks = vi.mocked(searchBooks);

describe("runBookRecommendationWorkflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns only the books selected by the AI", async () => {
    mockedAskAI
      .mockResolvedValueOnce(
        JSON.stringify({
          genre: "dark fantasy",
          author: null,
          similarBook: "Harry Potter",
          minimumPublicationYear: 2019,
          maximumPages: null,
          language: null,
        }),
      )
      .mockResolvedValueOnce(JSON.stringify(["/works/OL2W", "/works/OL3W"]));

    mockedSearchBooks.mockResolvedValue([
      {
        id: "/works/OL1W",
        title: "Old Fantasy Book",
        authors: ["Author One"],
        publishedDate: "2018",
      },
      {
        id: "/works/OL2W",
        title: "Fantasy Book Two",
        authors: ["Author Two"],
        publishedDate: "2022",
      },
      {
        id: "/works/OL3W",
        title: "Fantasy Book Three",
        authors: ["Author Three"],
        publishedDate: "2024",
      },
    ]);

    const result = await runBookRecommendationWorkflow(
      "I want a dark fantasy book similar to Harry Potter, published after 2018",
    );

    expect(mockedSearchBooks).toHaveBeenCalledWith("dark fantasy");

    expect(result).toEqual([
      {
        id: "/works/OL2W",
        title: "Fantasy Book Two",
        authors: ["Author Two"],
        publishedDate: "2022",
      },
      {
        id: "/works/OL3W",
        title: "Fantasy Book Three",
        authors: ["Author Three"],
        publishedDate: "2024",
      },
    ]);
  });

  it("filters books by minimumPublicationYear before sending them to the ranking AI", async () => {
    mockedAskAI
      .mockResolvedValueOnce(
        JSON.stringify({
          genre: "fantasy",
          author: null,
          similarBook: null,
          minimumPublicationYear: 2020,
          maximumPages: null,
          language: null,
        }),
      )
      .mockResolvedValueOnce(JSON.stringify(["/works/NEW"]));

    mockedSearchBooks.mockResolvedValue([
      {
        id: "/works/OLD",
        title: "Old Book",
        authors: ["Old Author"],
        publishedDate: "2015",
      },
      {
        id: "/works/NEW",
        title: "New Book",
        authors: ["New Author"],
        publishedDate: "2023",
      },
    ]);

    await runBookRecommendationWorkflow("Recommend a recent fantasy book");

    expect(mockedAskAI).toHaveBeenCalledTimes(2);

    const rankingPrompt = mockedAskAI.mock.calls[1][0];

    expect(rankingPrompt).toContain("New Book");
    expect(rankingPrompt).not.toContain("Old Book");
  });

  it("removes books without a publication date when a minimum year is required", async () => {
    mockedAskAI
      .mockResolvedValueOnce(
        JSON.stringify({
          genre: "fantasy",
          author: null,
          similarBook: null,
          minimumPublicationYear: 2020,
          maximumPages: null,
          language: null,
        }),
      )
      .mockResolvedValueOnce(JSON.stringify(["/works/WITH-DATE"]));

    mockedSearchBooks.mockResolvedValue([
      {
        id: "/works/NO-DATE",
        title: "Book Without Date",
        authors: ["Unknown"],
      },
      {
        id: "/works/WITH-DATE",
        title: "Book With Date",
        authors: ["Known Author"],
        publishedDate: "2024",
      },
    ]);

    const result = await runBookRecommendationWorkflow("Recent fantasy");

    expect(result).toEqual([
      {
        id: "/works/WITH-DATE",
        title: "Book With Date",
        authors: ["Known Author"],
        publishedDate: "2024",
      },
    ]);
  });

  it("accepts preferences returned inside a markdown JSON code block", async () => {
    mockedAskAI
      .mockResolvedValueOnce(
        `\`\`\`json
{
  "genre": "fantasy",
  "author": null,
  "similarBook": null,
  "minimumPublicationYear": null,
  "maximumPages": null,
  "language": null
}
\`\`\``,
      )
      .mockResolvedValueOnce(JSON.stringify(["/works/OL1W"]));

    mockedSearchBooks.mockResolvedValue([
      {
        id: "/works/OL1W",
        title: "Fantasy Book",
        authors: ["Fantasy Author"],
        publishedDate: "2024",
      },
    ]);

    const result = await runBookRecommendationWorkflow("I want fantasy");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Fantasy Book");
  });

  it("throws an error when the AI returns invalid book preferences", async () => {
    mockedAskAI.mockResolvedValueOnce(
      JSON.stringify({
        genre: "fantasy",
        author: null,
        similarBook: null,
        minimumPublicationYear: "2020",
        maximumPages: null,
        language: null,
      }),
    );

    await expect(
      runBookRecommendationWorkflow("Recommend a fantasy book"),
    ).rejects.toThrow("AI returned invalid book preferences");

    expect(mockedSearchBooks).not.toHaveBeenCalled();
  });

  it("ignores AI recommendation IDs that are not in the available books", async () => {
    mockedAskAI
      .mockResolvedValueOnce(
        JSON.stringify({
          genre: "fantasy",
          author: null,
          similarBook: null,
          minimumPublicationYear: null,
          maximumPages: null,
          language: null,
        }),
      )
      .mockResolvedValueOnce(
        JSON.stringify(["/works/VALID", "/works/NOT-IN-SEARCH-RESULTS"]),
      );

    mockedSearchBooks.mockResolvedValue([
      {
        id: "/works/VALID",
        title: "Valid Book",
        authors: ["Valid Author"],
        publishedDate: "2024",
      },
    ]);

    const result = await runBookRecommendationWorkflow("Fantasy");

    expect(result).toEqual([
      {
        id: "/works/VALID",
        title: "Valid Book",
        authors: ["Valid Author"],
        publishedDate: "2024",
      },
    ]);
  });
});
