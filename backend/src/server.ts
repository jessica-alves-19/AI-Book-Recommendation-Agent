import "dotenv/config";
import express from "express";
import cors from "cors";
//import { searchBooks } from "./services/googleBooksService.js";
import { searchBooks } from "./services/openLibraryService.js";
import "dotenv/config";
import { askAI } from "./services/openaiService.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

process.env.OPENAI_API_KEY;

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

app.post("/api/test-ai", async (req, res) => {
  try {
    const { query } = req.body;

    const result = await askAI(query);

    res.json({
      result,
    });
  } catch (error) {
    console.error("OPENROUTER ERROR:", error);

    res.status(500).json({
      error: "AI request failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});
