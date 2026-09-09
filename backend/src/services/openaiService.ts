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

export function buildBookPrompt(query: string): string {
  return `
You are a book recommendation assistant.

Your job is to understand the user's book preferences.

Analyze the following user request and identify:

- genre
- themes
- mood
- similar books or authors

User request:
"${query}"

Return the result in a clear and concise format.
`;
}
