import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY не задан — AI-функции недоступны");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "missing",
});

export const AI_MODEL = "gpt-4o-mini";

/** Базовый запрос к OpenAI, возвращает текст */
export async function complete(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 600
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: maxTokens,
    temperature: 0.85,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}

/** Запрос с ожиданием JSON-ответа */
export async function completeJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 1200
): Promise<T> {
  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: maxTokens,
    temperature: 0.85,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? "{}";
  return JSON.parse(raw) as T;
}
