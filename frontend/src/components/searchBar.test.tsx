import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "./searchBar";

describe("SearchBar", () => {
  it("renders the search input", () => {
    render(
      <SearchBar
        query=""
        onQueryChange={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );

    expect(
      screen.getByPlaceholderText("What kind of book are you looking for?"),
    ).toBeInTheDocument();
  });

  it("calls onQueryChange when the user types", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();

    render(
      <SearchBar
        query=""
        onQueryChange={onQueryChange}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );

    const input = screen.getByRole("textbox");

    await user.type(input, "fantasy");

    expect(onQueryChange).toHaveBeenCalled();
  });

  it("submits the form when the search button is clicked", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());

    render(
      <SearchBar
        query="fantasy"
        onQueryChange={vi.fn()}
        onSubmit={onSubmit}
        loading={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
