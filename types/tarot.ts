export type Arcana = "major" | "minor";

export type Suit = "cups" | "wands" | "swords" | "pentacles";

export interface TarotCardData {
  id: string;
  nameRu: string;
  nameEn: string;
  arcana: Arcana;
  suit?: Suit;
  number: number;
  keywordsUpright: string[];
  keywordsReversed: string[];
  imageUrl: string;
}

export interface DrawnCard {
  card: TarotCardData;
  isReversed: boolean;
}

export type SpreadType = "daily" | "yes-no" | "relationship";

export interface SpreadPosition {
  index: number;
  label: string;
  description?: string;
}

export const RELATIONSHIP_POSITIONS: SpreadPosition[] = [
  { index: 0, label: "Ты", description: "Твоя энергия в этих отношениях" },
  { index: 1, label: "Партнёр", description: "Энергия партнёра" },
  { index: 2, label: "Прошлое", description: "Что привело к этому моменту" },
  { index: 3, label: "Настоящее", description: "Суть происходящего сейчас" },
  { index: 4, label: "Будущее", description: "Куда ведёт эта ситуация" },
];
