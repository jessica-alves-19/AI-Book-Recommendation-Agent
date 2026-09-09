import { useState } from "react";
import { useBookRecommendations } from "./hooks/useBookRecommendations";
import { BookCard } from "./components/bookCard";
import { SearchBar } from "./components/searchBar";
import type { Book } from "./types/book";

function App() {
  const [query, setQuery] = useState("");

  const { loading, error, recommendations, getRecommendations } =
    useBookRecommendations();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    await getRecommendations(query);
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <h1 className="mb-10 text-center text-3xl font-bold">
          AI Book Recommendation Agent
        </h1>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {loading && (
          <p className="mt-8 text-center">
            🤖 Finding the best books for you...
          </p>
        )}

        {error && <p className="mt-8 text-center text-red-400">{error}</p>}

        {recommendations.length > 0 && (
          <section className="mt-12">
            <div className="space-y-5">
              {recommendations.map((book: Book) => (
                <BookCard
                  key={book.id}
                  title={book.title}
                  authors={book.authors}
                  publishedDate={book.publishedDate}
                  thumbnail={book.thumbnail}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
