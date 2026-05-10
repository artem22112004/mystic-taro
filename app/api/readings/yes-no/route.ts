import { NextRequest, NextResponse } from "next/server";
import { drawCard } from "@/lib/tarot";
import { completeJSON } from "@/lib/openai";
import { buildYesNoPrompt, TAROT_SYSTEM_PROMPT } from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";

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

    // Заглушка оплаты — Фаза 8
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

    // Сохраняем в историю если пользователь авторизован
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("readings").insert({
        user_id: user.id,
        type: "yes-no",
        question: question.trim(),
        cards: [{ id: drawn.card.id, isReversed: drawn.isReversed }],
        interpretation: { answer: result.answer, text: result.interpretation },
        paid_amount: 49,
      });
    }

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
