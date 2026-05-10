export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string | null;
        };
      };
      readings: {
        Row: {
          id: string;
          user_id: string | null;
          type: "daily" | "yes-no" | "relationship";
          question: string | null;
          cards: Json;
          interpretation: Json;
          paid_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type: "daily" | "yes-no" | "relationship";
          question?: string | null;
          cards: Json;
          interpretation: Json;
          paid_amount?: number;
          created_at?: string;
        };
        Update: never;
      };
      daily_cards: {
        Row: {
          id: string;
          user_id: string;
          card_id: string;
          is_reversed: boolean;
          interpretation: string | null;
          drawn_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id: string;
          is_reversed: boolean;
          interpretation?: string | null;
          drawn_date?: string;
          created_at?: string;
        };
        Update: {
          interpretation?: string | null;
        };
      };
    };
  };
}
