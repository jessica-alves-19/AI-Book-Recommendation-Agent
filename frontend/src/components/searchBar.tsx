interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export function SearchBar({
  query,
  onQueryChange,
  onSubmit,
  loading,
}: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="What kind of book are you looking for?"
        className="search-bar__input"
      />

      <button
        type="submit"
        disabled={loading}
        className="search-bar__button"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
