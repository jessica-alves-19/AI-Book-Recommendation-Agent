import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function askAI(prompt: string): Promise<string> {
  const response = await openai.responses.create({
    model: "openrouter/free",
    input: prompt,
  });

  return response.output_text;
}
