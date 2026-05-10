"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard } from "@/components/ui/tarot-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MysticLoader } from "@/components/ui/mystic-loader";
import { Sparkles, Heart, Sun, History } from "lucide-react";
import Link from "next/link";
import type { TarotCardData } from "@/types/tarot";

interface DailyReading {
  card: TarotCardData;
  isReversed: boolean;
  interpretation: string;
}

const SPREADS = [
  {
    href: "/spread/yes-no",
    icon: Sparkles,
    title: "Да или Нет",
    desc: "Один вопрос — один ответ",
    price: "49 ₽",
    color: "border-gold/30 hover:border-gold/60",
  },
  {
    href: "/spread/relationship",
    icon: Heart,
    title: "На отношения",
    desc: "Пять карт — пять измерений",
    price: "199 ₽",
    color: "border-mystic/30 hover:border-mystic/60",
  },
  {
    href: "/spread/day",
    icon: Sun,
    title: "Расклад на день",
    desc: "Три карты — утро, день, вечер",
    price: "99 ₽",
    color: "border-gold/20 hover:border-gold/40",
    soon: true,
  },
];

export default function HomePage() {
  const [daily, setDaily] = useState<DailyReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/readings/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "anonymous" }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setDaily(data);
      })
      .catch(() => setError("Не удалось загрузить карту дня"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFlip = () => {
    if (!daily || isFlipped) return;
    setIsFlipped(true);
    setTimeout(() => setShowInterpretation(true), 700);
  };

  return (
    <div className="px-4 pt-12 pb-6 space-y-8">
      {/* Заголовок */}
      <div className="text-center space-y-1">
        <p className="text-gold/50 text-xs tracking-[0.3em] uppercase">
          ✦ мистические ✦
        </p>
        <h1 className="font-heading text-3xl text-gold tracking-wide">
          Расклады
        </h1>
      </div>

      {/* Карта дня */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-foreground/80 text-base tracking-wide">
            Карта сегодняшнего дня
          </h2>
          <span className="text-xs text-gold/60 bg-gold/10 px-2 py-0.5 rounded-full">
            бесплатно
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <MysticLoader />
          ) : error ? (
            <p className="text-muted-foreground text-sm text-center py-6">{error}</p>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="cursor-pointer"
                onClick={handleFlip}
              >
                <TarotCard
                  name={daily!.card.nameRu}
                  nameEn={daily!.card.nameEn}
                  isReversed={daily!.isReversed}
                  isFlipped={isFlipped}
                  size="lg"
                />
              </motion.div>

              {!isFlipped && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground text-xs text-center"
                >
                  Нажми на карту, чтобы открыть послание дня
                </motion.p>
              )}

              <AnimatePresence>
                {showInterpretation && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                  >
                    <Card className="border-gold/20">
                      <CardContent className="pt-4">
                        <p className="font-heading text-gold text-sm mb-2">
                          {daily!.card.nameRu}
                          {daily!.isReversed && (
                            <span className="text-mystic-light text-xs ml-2">
                              (перевёрнутая)
                            </span>
                          )}
                        </p>
                        <p className="text-foreground/85 text-sm leading-relaxed">
                          {daily!.interpretation}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      {/* Расклады */}
      <section className="space-y-3">
        <h2 className="font-heading text-foreground/80 text-base tracking-wide">
          Расклады
        </h2>

        <div className="space-y-3">
          {SPREADS.map(({ href, icon: Icon, title, desc, price, color, soon }) => (
            <Link
              key={href}
              href={soon ? "#" : href}
              className={soon ? "pointer-events-none" : ""}
            >
              <Card
                className={`border transition-all duration-200 active:scale-[0.98] ${color} ${
                  soon ? "opacity-50" : "cursor-pointer"
                }`}
              >
                <CardContent className="pt-4 pb-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm">{title}</p>
                      {soon && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          скоро
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
                  </div>
                  <span className="text-gold font-medium text-sm shrink-0">{price}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* История */}
      <Link href="/history">
        <Button variant="ghost" className="w-full gap-2">
          <History size={16} />
          История раскладов
        </Button>
      </Link>
    </div>
  );
}
