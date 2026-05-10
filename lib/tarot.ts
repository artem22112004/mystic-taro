import { tarotDeck } from "@/data/tarot-deck";
import type { TarotCardData, DrawnCard } from "@/types/tarot";

/** Перемешивает массив (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Вытягивает одну карту с 50% шансом перевёрнутой */
export function drawCard(): DrawnCard {
  const deck = shuffle(tarotDeck);
  return {
    card: deck[0],
    isReversed: Math.random() < 0.5,
  };
}

/** Вытягивает count уникальных карт без повторов */
export function drawCards(count: number): DrawnCard[] {
  if (count > tarotDeck.length) {
    throw new Error(`Нельзя вытянуть ${count} карт из колоды в ${tarotDeck.length} карт`);
  }

  return shuffle(tarotDeck)
    .slice(0, count)
    .map((card) => ({
      card,
      isReversed: Math.random() < 0.5,
    }));
}

/** Возвращает карту по id */
export function getCardById(id: string): TarotCardData | undefined {
  return tarotDeck.find((c) => c.id === id);
}

/** Все карты Старших Арканов */
export function getMajorArcana(): TarotCardData[] {
  return tarotDeck.filter((c) => c.arcana === "major");
}

/** Карта дня для конкретного пользователя (детерминированная по дате + userId) */
export function getDailyCard(userId: string): DrawnCard {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const seed = hashString(`${userId}-${today}`);
  const index = seed % tarotDeck.length;
  const reversedSeed = hashString(`${userId}-${today}-rev`);

  return {
    card: tarotDeck[index],
    isReversed: reversedSeed % 2 === 0,
  };
}

/** Простой числовой хэш строки */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}
