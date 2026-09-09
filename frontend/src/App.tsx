import { useState } from "react";
import { useBookRecommendations } from "./hooks/useBookRecommendations";
import { BookCard } from "./components/bookCard";
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
    <main>
      <h1>AI Book Recommendation Agent</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What kind of book are you looking for?"
        />

        <button type="submit">Recommend books</button>
      </form>

      {loading && (
        <div>
          <p>🤖 AI is finding the best books for you...</p>
        </div>
      )}

      {error && <p>{error}</p>}

      <div>
        {recommendations.map((book: Book) => (
          <BookCard
            key={book.id}
            title={book.title}
            authors={book.authors}
            publishedDate={book.publishedDate}
            description={book.description}
            thumbnail={book.thumbnail}
          />
        ))}
      </div>
    </main>
  );
}

export default App;
