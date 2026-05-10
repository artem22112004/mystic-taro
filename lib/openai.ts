import OpenAI from "openai";

const hasKey = Boolean(process.env.OPENAI_API_KEY);

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "missing",
});

export const AI_MODEL = "gpt-4o-mini";

const MOCK_INTERPRETATIONS = [
  "Карта указывает на период перемен. Доверяй своей интуиции — она сейчас острее, чем кажется. Внешние обстоятельства складываются в твою пользу, но потребуется терпение.",
  "Сейчас важно не торопить события. То, что кажется препятствием, на самом деле даёт тебе время подготовиться. Обрати внимание на то, что остаётся незамеченным.",
  "Эта карта говорит о скрытых ресурсах. У тебя есть всё необходимое для следующего шага — нужно лишь признать это. Действуй из позиции силы, а не страха.",
  "Период завершения одного цикла и начала другого. Не держись за то, что уже отслужило своё. Впереди — более подходящие возможности.",
  "Карта указывает на необходимость баланса. Ты слишком долго смотришь только в одну сторону. Расширь перспективу — ответ уже рядом.",
];

const MOCK_CONCLUSIONS = [
  "Ситуация находится в точке трансформации. Обоим нужно время, чтобы принять происходящее. Честный разговор сейчас важнее правильных слов.",
  "Между вами есть настоящая связь, но она требует осознанного внимания. Не позволяй повседневному шуму заглушать то, что действительно важно.",
  "Энергия ситуации движется к разрешению. Доверяй процессу и своему ощущению — оно не обманывает.",
];

function mockText(): string {
  return MOCK_INTERPRETATIONS[Math.floor(Math.random() * MOCK_INTERPRETATIONS.length)];
}

function mockJSON<T>(userPrompt: string): T {
  if (userPrompt.includes("interpretations")) {
    return {
      interpretations: Array(5).fill(null).map(() => mockText()),
      conclusion: MOCK_CONCLUSIONS[Math.floor(Math.random() * MOCK_CONCLUSIONS.length)],
    } as T;
  }
  const answers = ["да", "скорее да", "нет", "пока неясно"];
  return {
    answer: answers[Math.floor(Math.random() * answers.length)],
    interpretation: mockText(),
  } as T;
}

/** Базовый запрос к OpenAI, возвращает текст */
export async function complete(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 600
): Promise<string> {
  if (!hasKey) return mockText();

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
  if (!hasKey) return mockJSON<T>(userPrompt);

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
