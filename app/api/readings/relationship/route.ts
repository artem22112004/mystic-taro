import { NextRequest, NextResponse } from "next/server";
import { drawCards } from "@/lib/tarot";
import { completeJSON } from "@/lib/openai";
import { buildRelationshipPrompt, TAROT_SYSTEM_PROMPT } from "@/lib/prompts";
import { RELATIONSHIP_POSITIONS } from "@/types/tarot";
import { createClient } from "@/lib/supabase/server";

interface RelationshipResponse {
  interpretations: string[];
  conclusion: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const yourName: string = (body.yourName ?? "").trim();
    const partnerName: string = (body.partnerName ?? "").trim();
    const situation: string = (body.situation ?? "").trim();

    if (!yourName || !partnerName) {
      return NextResponse.json(
        { error: "Укажи своё имя и имя партнёра." },
        { status: 400 }
      );
    }
    if (!situation || situation.length < 10) {
      return NextResponse.json(
        { error: "Опиши ситуацию подробнее." },
        { status: 400 }
      );
    }

    // Заглушка оплаты — Фаза 8
    const isPaid = true;
    if (!isPaid) {
      return NextResponse.json({ error: "Требуется оплата" }, { status: 402 });
    }

    const cards = drawCards(5);
    const result = await completeJSON<RelationshipResponse>(
      TAROT_SYSTEM_PROMPT,
      buildRelationshipPrompt(cards, RELATIONSHIP_POSITIONS, { yourName, partnerName, situation }),
      1200
    );

    const interpretations = Array.isArray(result.interpretations)
      ? result.interpretations
      : RELATIONSHIP_POSITIONS.map(() => "");

    // Сохраняем в историю если пользователь авторизован
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("readings").insert({
        user_id: user.id,
        type: "relationship",
        question: `${yourName} и ${partnerName}: ${situation}`,
        cards: cards.map(({ card, isReversed }) => ({ id: card.id, isReversed })),
        interpretation: { interpretations, conclusion: result.conclusion },
        paid_amount: 199,
      });
    }

    return NextResponse.json({
      cards: cards.map(({ card, isReversed }) => ({ card, isReversed })),
      positions: RELATIONSHIP_POSITIONS,
      interpretations,
      conclusion: result.conclusion ?? "",
    });
  } catch (err) {
    console.error("[/api/readings/relationship]", err);
    return NextResponse.json(
      { error: "Не удалось выполнить расклад. Попробуй ещё раз." },
      { status: 500 }
    );
  }
}
