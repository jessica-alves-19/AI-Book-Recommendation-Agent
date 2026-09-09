import "dotenv/config";
import express from "express";
import cors from "cors";
import { runBookRecommendationWorkflow } from "./agents/bookRecommendationWorkflow.js";
import { mockBookRecommendations } from "./mocks/bookRecommendationsMock.js";

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

    const result = await runBookRecommendationWorkflow(query);

    res.json({
      recommendations: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to generate recommendations",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

//Mocks if necessary

/*app.post("/api/recommendations", async (req, res) => {
  try {
    const { query } = req.body;

    const useMock = process.env.USE_AI_MOCK === "true";

    if (useMock) {
      console.log("USING MOCK RECOMMENDATIONS");

      return res.json({
        recommendations: mockBookRecommendations,
      });
    }

    const result = await runBookRecommendationWorkflow(query);

    return res.json({
      recommendations: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to generate recommendations",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});*/
