import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookCard } from "./bookCard";

describe("BookCard", () => {
  it("renders the book information", () => {
    render(
      <BookCard
        title="Phantasma"
        authors={["Kaylie Smith"]}
        publishedDate="2024"
        thumbnail="https://example.com/cover.jpg"
      />,
    );

    expect(screen.getByText("Phantasma")).toBeInTheDocument();
    expect(screen.getByText("Kaylie Smith")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("renders the book cover", () => {
    render(
      <BookCard
        title="Phantasma"
        authors={["Kaylie Smith"]}
        thumbnail="https://example.com/cover.jpg"
      />,
    );

    const image = screen.getByRole("img", {
      name: "Cover of Phantasma",
    });

    expect(image).toHaveAttribute("src", "https://example.com/cover.jpg");
  });

  it("shows fallback values when data is missing", () => {
    render(<BookCard title="Unknown Book" authors={[]} />);

    expect(screen.getByText("Unknown author")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
