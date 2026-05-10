"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard } from "@/components/ui/tarot-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MysticLoader } from "@/components/ui/mystic-loader";
import { ChevronLeft, Heart } from "lucide-react";
import Link from "next/link";
import type { TarotCardData } from "@/types/tarot";

interface RelationshipResult {
  cards: { card: TarotCardData; isReversed: boolean }[];
  positions: { label: string; description?: string }[];
  interpretations: string[];
  conclusion: string;
}

interface FormData {
  yourName: string;
  partnerName: string;
  situation: string;
}

export default function RelationshipPage() {
  const [form, setForm] = useState<FormData>({ yourName: "", partnerName: "", situation: "" });
  const [phase, setPhase] = useState<"form" | "loading" | "result">("form");
  const [result, setResult] = useState<RelationshipResult | null>(null);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    form.yourName.trim().length >= 2 &&
    form.partnerName.trim().length >= 2 &&
    form.situation.trim().length >= 10;

  const handleSubmit = async () => {
    if (!isValid) return;
    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/readings/relationship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setFlipped(new Array(5).fill(false));
      setPhase("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Что-то пошло не так");
      setPhase("form");
    }
  };

  const flipCard = (i: number) => {
    setFlipped((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const allFlipped = flipped.every(Boolean);

  return (
    <div className="px-4 pt-8 pb-6 space-y-6">
      {/* Шапка */}
      <div className="flex items-center gap-3">
        <Link href="/">
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="font-heading text-gold text-xl tracking-wide">На отношения</h1>
          <p className="text-muted-foreground text-xs">Пять карт — пять измерений · 199 ₽</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Форма ── */}
        {phase === "form" && (
          <motion.div
            key="form"
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-muted-foreground text-sm leading-relaxed">
              Расклад покажет энергию каждого из вас, что привело к этой точке и куда ведёт ситуация.
            </p>

            <div className="space-y-3">
              {[
                { key: "yourName", label: "Твоё имя", placeholder: "Аня" },
                { key: "partnerName", label: "Имя партнёра", placeholder: "Саша" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                  <input
                    value={form[key as keyof FormData]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl bg-card border border-white/[0.08] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Опиши ситуацию
                </label>
                <textarea
                  value={form.situation}
                  onChange={(e) => setForm((f) => ({ ...f, situation: e.target.value }))}
                  placeholder="Мы встречаемся полгода, всё хорошо, но я чувствую дистанцию..."
                  className="w-full h-28 rounded-xl bg-card border border-white/[0.08] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>
            </div>

            {error && <p className="text-red-400/80 text-sm text-center">{error}</p>}

            <Button className="w-full" onClick={handleSubmit} disabled={!isValid}>
              <Heart size={16} />
              Получить расклад
            </Button>
          </motion.div>
        )}

        {/* ── Загрузка ── */}
        {phase === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MysticLoader />
          </motion.div>
        )}

        {/* ── Результат ── */}
        {phase === "result" && result && (
          <motion.div
            key="result"
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Имена */}
            <div className="text-center">
              <p className="font-heading text-gold text-lg">
                {form.yourName} <span className="text-gold/40 text-sm">и</span> {form.partnerName}
              </p>
            </div>

            {/* 5 карт — сетка 2-2-1 */}
            <div className="space-y-4">
              <p className="text-muted-foreground text-xs text-center">
                Нажми на каждую карту, чтобы открыть
              </p>

              {/* Ряд 1: позиции 0 и 1 */}
              <div className="flex justify-center gap-4">
                {[0, 1].map((i) => (
                  <CardSlot
                    key={i}
                    index={i}
                    result={result}
                    flipped={flipped}
                    onFlip={flipCard}
                  />
                ))}
              </div>

              {/* Ряд 2: позиции 2 и 3 */}
              <div className="flex justify-center gap-4">
                {[2, 3].map((i) => (
                  <CardSlot
                    key={i}
                    index={i}
                    result={result}
                    flipped={flipped}
                    onFlip={flipCard}
                  />
                ))}
              </div>

              {/* Ряд 3: позиция 4 по центру */}
              <div className="flex justify-center">
                <CardSlot index={4} result={result} flipped={flipped} onFlip={flipCard} />
              </div>
            </div>

            {/* Общий вывод — после открытия всех карт */}
            <AnimatePresence>
              {allFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-gold/30">
                    <CardContent className="pt-4">
                      <p className="font-heading text-gold text-sm mb-3">
                        ✦ Общий вывод
                      </p>
                      <p className="text-foreground/85 text-sm leading-relaxed">
                        {result.conclusion}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setPhase("form");
                setResult(null);
                setFlipped([]);
              }}
            >
              Новый расклад
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Карта с позицией ─────────────────────────────────── */
function CardSlot({
  index,
  result,
  flipped,
  onFlip,
}: {
  index: number;
  result: RelationshipResult;
  flipped: boolean[];
  onFlip: (i: number) => void;
}) {
  const { card, isReversed } = result.cards[index];
  const position = result.positions[index];
  const interpretation = result.interpretations[index];
  const isOpen = flipped[index];

  return (
    <div className="flex flex-col items-center gap-2 max-w-[150px]">
      <p className="text-gold/60 text-[10px] uppercase tracking-wider text-center">
        {position.label}
      </p>
      <TarotCard
        name={card.nameRu}
        nameEn={card.nameEn}
        isReversed={isReversed}
        isFlipped={isOpen}
        onClick={() => onFlip(index)}
        size="sm"
      />
      <AnimatePresence>
        {isOpen && interpretation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <p className="text-foreground/75 text-[11px] leading-relaxed text-center px-1">
              {interpretation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
