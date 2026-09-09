import { useState } from "react";

export function useBookRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState([]);

  async function getRecommendations(query: string) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:3000/api/recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      console.log("API RESPONSE:", data);
      setRecommendations(data.recommendations);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    recommendations,
    getRecommendations,
  };
}
