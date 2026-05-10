import { NextRequest, NextResponse } from "next/server";
import { drawCard } from "@/lib/tarot";
import { completeJSON } from "@/lib/openai";
import { buildYesNoPrompt, TAROT_SYSTEM_PROMPT } from "@/lib/prompts";

interface YesNoResponse {
  answer: string;
  interpretation: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question: string = body.question ?? "";

    if (!question || question.trim().length < 10) {
      return NextResponse.json(
        { error: "Вопрос слишком короткий. Сформулируй его подробнее." },
        { status: 400 }
      );
    }

    // Заглушка оплаты — в Фазе 7 будет реальная проверка
    const isPaid = true;
    if (!isPaid) {
      return NextResponse.json({ error: "Требуется оплата" }, { status: 402 });
    }

    const drawn = drawCard();

    const result = await completeJSON<YesNoResponse>(
      TAROT_SYSTEM_PROMPT,
      buildYesNoPrompt(drawn, question.trim()),
      500
    );

    return NextResponse.json({
      card: drawn.card,
      isReversed: drawn.isReversed,
      answer: result.answer ?? "пока неясно",
      interpretation: result.interpretation ?? "",
    });
  } catch (err) {
    console.error("[/api/readings/yes-no]", err);
    return NextResponse.json(
      { error: "Не удалось выполнить расклад. Попробуй ещё раз." },
      { status: 500 }
    );
  }
}
