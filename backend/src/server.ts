import "dotenv/config";

import express from "express";
import cors from "cors";
import { searchBooks } from "./services/googleBooksService.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.post("/api/recommendations", async (req, res) => {
  try {
    const { query } = req.body;

    const books = await searchBooks(query);

    res.json({
      query,
      books,
    });
  } catch (error) {
    console.error("GOOGLE BOOKS ERROR:", error);

    res.status(500).json({
      error: "Failed to search books",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});
