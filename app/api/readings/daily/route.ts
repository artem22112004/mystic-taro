import { NextResponse } from "next/server";
import { getDailyCard, getCardById } from "@/lib/tarot";
import { complete } from "@/lib/openai";
import { buildDailyPrompt, TAROT_SYSTEM_PROMPT } from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Для неавторизованных — генерируем без кэша
    if (!user) {
      const drawn = getDailyCard("anonymous");
      const interpretation = await complete(TAROT_SYSTEM_PROMPT, buildDailyPrompt(drawn), 300);
      return NextResponse.json({ card: drawn.card, isReversed: drawn.isReversed, interpretation });
    }

    const today = new Date().toISOString().slice(0, 10);

    // Проверяем кэш в daily_cards
    const { data: cached } = await supabase
      .from("daily_cards")
      .select("*")
      .eq("user_id", user.id)
      .eq("drawn_date", today)
      .single() as { data: { card_id: string; is_reversed: boolean; interpretation: string | null } | null; error: unknown };

    if (cached) {
      const card = getCardById(cached.card_id);
      if (card) {
        return NextResponse.json({
          card,
          isReversed: cached.is_reversed,
          interpretation: cached.interpretation ?? "",
        });
      }
    }

    // Генерируем новую карту дня
    const drawn = getDailyCard(user.id);
    const interpretation = await complete(TAROT_SYSTEM_PROMPT, buildDailyPrompt(drawn), 300);

    // Сохраняем в кэш
    await supabase.from("daily_cards").upsert({
      user_id: user.id,
      card_id: drawn.card.id,
      is_reversed: drawn.isReversed,
      interpretation,
      drawn_date: today,
    });

    // Сохраняем в историю раскладов
    await supabase.from("readings").insert({
      user_id: user.id,
      type: "daily",
      cards: [{ id: drawn.card.id, isReversed: drawn.isReversed }],
      interpretation: { text: interpretation },
      paid_amount: 0,
    });

    return NextResponse.json({ card: drawn.card, isReversed: drawn.isReversed, interpretation });
  } catch (err) {
    console.error("[/api/readings/daily]", err);
    return NextResponse.json(
      { error: "Не удалось получить карту дня. Попробуй ещё раз." },
      { status: 500 }
    );
  }
}
