import { NextRequest, NextResponse } from "next/server";
import { getDailyCard } from "@/lib/tarot";
import { complete } from "@/lib/openai";
import { buildDailyPrompt, TAROT_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId: string = body.userId ?? "anonymous";

    // Заглушка авторизации — карта дня бесплатна
    const drawn = getDailyCard(userId);

    const interpretation = await complete(
      TAROT_SYSTEM_PROMPT,
      buildDailyPrompt(drawn),
      300
    );

    return NextResponse.json({
      card: drawn.card,
      isReversed: drawn.isReversed,
      interpretation,
    });
  } catch (err) {
    console.error("[/api/readings/daily]", err);
    return NextResponse.json(
      { error: "Не удалось получить карту дня. Попробуй ещё раз." },
      { status: 500 }
    );
  }
}
