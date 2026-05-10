import type { DrawnCard } from "@/types/tarot";
import type { RELATIONSHIP_POSITIONS } from "@/types/tarot";

// ── Системный промпт — общий для всех раскладов ───────────

export const TAROT_SYSTEM_PROMPT = `Ты — опытный таролог с глубоким пониманием психологии и символизма карт. Ты говоришь напрямую, тепло и честно — как близкий человек, который умеет читать карты. Ты не изрекаешь банальности про "вселенную" и "энергии". Ты обращаешься к конкретному человеку, говоришь "ты" и "твой", опираешься на реальные значения карт.

Правила:
- Пиши по-русски, живым языком без канцеляризмов
- Никогда не пиши "вселенная подсказывает", "карты говорят", "энергии указывают"
- Будь конкретным, не общим — каждое предложение должно нести смысл
- Перевёрнутая карта — не катастрофа, а предупреждение или внутренний блок
- Не пугай и не давай пустых обещаний
- Длина ответа — строго по инструкции к каждому раскладу`;

// ── Карта дня ─────────────────────────────────────────────

export function buildDailyPrompt(drawn: DrawnCard): string {
  const { card, isReversed } = drawn;
  const position = isReversed ? "в перевёрнутом положении" : "в прямом положении";
  const keywords = isReversed ? card.keywordsReversed : card.keywordsUpright;

  return `Карта дня: ${card.nameRu} (${card.nameEn}), ${position}.
Ключевые темы: ${keywords.join(", ")}.

Напиши короткую трактовку карты дня — 3–4 предложения. Это не предсказание дня, а приглашение к осознанности: что стоит заметить, на что обратить внимание, с каким внутренним состоянием войти в день. Пиши от второго лица.`;
}

// ── Расклад Да/Нет ────────────────────────────────────────

export function buildYesNoPrompt(drawn: DrawnCard, question: string): string {
  const { card, isReversed } = drawn;
  const position = isReversed ? "в перевёрнутом положении" : "в прямом положении";
  const keywords = isReversed ? card.keywordsReversed : card.keywordsUpright;

  return `Вопрос: "${question}"
Карта: ${card.nameRu} (${card.nameEn}), ${position}.
Ключевые темы карты: ${keywords.join(", ")}.

Ответь в формате JSON:
{
  "answer": "да" | "нет" | "скорее да" | "скорее нет" | "пока неясно",
  "interpretation": "Развёрнутый ответ на вопрос через эту карту — 4–6 предложений. Объясни, почему именно такой ответ и что за ним стоит применительно к конкретному вопросу человека. Будь прямым."
}`;
}

// ── Расклад на отношения (5 карт) ─────────────────────────

type RelationshipContext = {
  yourName: string;
  partnerName: string;
  situation: string;
};

type RelationshipPositionLabel = typeof RELATIONSHIP_POSITIONS[number]["label"];

export function buildRelationshipPrompt(
  cards: DrawnCard[],
  positions: readonly { label: string; description?: string }[],
  context: RelationshipContext
): string {
  const cardsBlock = cards
    .map((drawn, i) => {
      const pos = positions[i];
      const { card, isReversed } = drawn;
      const keywords = (isReversed ? card.keywordsReversed : card.keywordsUpright).join(", ");
      return `Позиция "${pos.label}" (${pos.description ?? ""}): ${card.nameRu}${isReversed ? " (перевёрнутая)" : ""} — темы: ${keywords}`;
    })
    .join("\n");

  return `Расклад на отношения.
Имена: ${context.yourName} и ${context.partnerName}.
Ситуация: "${context.situation}"

Карты:
${cardsBlock}

Ответь в формате JSON:
{
  "interpretations": [
    "Трактовка позиции 1 (Ты) — 2–3 предложения",
    "Трактовка позиции 2 (Партнёр) — 2–3 предложения",
    "Трактовка позиции 3 (Прошлое) — 2–3 предложения",
    "Трактовка позиции 4 (Настоящее) — 2–3 предложения",
    "Трактовка позиции 5 (Будущее) — 2–3 предложения"
  ],
  "conclusion": "Общий вывод расклада — 4–5 предложений. Свяжи все пять карт в единую картину. Обратись к ${context.yourName} напрямую. Укажи на ключевой паттерн и что с ним можно сделать."
}

Используй имена ${context.yourName} и ${context.partnerName} в тексте. Будь честным, не давай ложных надежд.`;
}
