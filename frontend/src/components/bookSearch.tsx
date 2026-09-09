import { useState } from "react";

export function BookSearch() {
  const [query, setQuery] = useState("");

  const handleSubmit = async () => {
    const response = await fetch(
      "http://localhost:3000/api/recommendations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();

    console.log(data);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="What kind of book are you looking for?"
      />

      <button onClick={handleSubmit}>
        Find Books
      </button>
    </div>
  );
}