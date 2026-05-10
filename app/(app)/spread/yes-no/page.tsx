"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard } from "@/components/ui/tarot-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MysticLoader } from "@/components/ui/mystic-loader";
import { PaymentSheet } from "@/components/ui/payment-sheet";
import { ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { isPaid, consumePaid } from "@/lib/payment";
import type { TarotCardData } from "@/types/tarot";

interface YesNoResult {
  card: TarotCardData;
  isReversed: boolean;
  answer: string;
  interpretation: string;
}

const ANSWER_COLORS: Record<string, string> = {
  "да": "text-emerald-400",
  "скорее да": "text-emerald-400/80",
  "нет": "text-red-400",
  "скорее нет": "text-red-400/80",
  "пока неясно": "text-gold",
};

export default function YesNoPage() {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<"form" | "loading" | "result">("form");
  const [result, setResult] = useState<YesNoResult | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showText, setShowText] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const isValid = question.trim().length >= 10;

  const callApi = async () => {
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch("/api/readings/yes-no", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setPhase("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Что-то пошло не так");
      setPhase("form");
    }
  };

  const handleSubmit = () => {
    if (!isValid) return;
    if (isPaid("yes-no")) {
      consumePaid("yes-no");
      callApi();
    } else {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    consumePaid("yes-no");
    callApi();
  };

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    setTimeout(() => setShowText(true), 700);
  };

  const handleReset = () => {
    setQuestion("");
    setPhase("form");
    setResult(null);
    setIsFlipped(false);
    setShowText(false);
    setError(null);
  };

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
          <h1 className="font-heading text-gold text-xl tracking-wide">Да или Нет</h1>
          <p className="text-muted-foreground text-xs">Один вопрос — один ответ · 49 ₽</p>
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
              Сформулируй вопрос конкретно. Карта отвечает честно — не так, как ты хочешь услышать.
            </p>

            <div className="space-y-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Стоит ли мне сейчас сменить работу?"
                className="w-full h-28 rounded-xl bg-card border border-white/[0.08] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-gold/40 transition-colors"
              />
              <p className={`text-xs text-right ${question.trim().length >= 10 ? "text-gold/60" : "text-muted-foreground"}`}>
                {question.trim().length} / мин. 10 символов
              </p>
            </div>

            {error && (
              <p className="text-red-400/80 text-sm text-center">{error}</p>
            )}

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              <Sparkles size={16} />
              Получить ответ · 49 ₽
            </Button>
          </motion.div>
        )}

        {/* ── Загрузка ── */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MysticLoader />
          </motion.div>
        )}

        {/* ── Результат ── */}
        {phase === "result" && result && (
          <motion.div
            key="result"
            className="space-y-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Вопрос */}
            <div className="bg-card/50 rounded-xl px-4 py-3 border border-white/[0.06]">
              <p className="text-muted-foreground text-xs mb-1">Твой вопрос</p>
              <p className="text-foreground text-sm">"{question}"</p>
            </div>

            {/* Карта */}
            <div className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={handleFlip}
              >
                <TarotCard
                  name={result.card.nameRu}
                  nameEn={result.card.nameEn}
                  isReversed={result.isReversed}
                  isFlipped={isFlipped}
                  size="lg"
                />
              </motion.div>

              {!isFlipped && (
                <p className="text-muted-foreground text-xs text-center">
                  Нажми на карту, чтобы увидеть ответ
                </p>
              )}
            </div>

            {/* Ответ и трактовка */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Ответ */}
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs mb-1">Ответ</p>
                    <p className={`font-heading text-3xl capitalize ${ANSWER_COLORS[result.answer] ?? "text-gold"}`}>
                      {result.answer}
                    </p>
                  </div>

                  {/* Трактовка */}
                  <Card className="border-gold/20">
                    <CardContent className="pt-4">
                      <p className="font-heading text-gold text-sm mb-2">
                        {result.card.nameRu}
                        {result.isReversed && (
                          <span className="text-mystic-light text-xs ml-2">(перевёрнутая)</span>
                        )}
                      </p>
                      <p className="text-foreground/85 text-sm leading-relaxed">
                        {result.interpretation}
                      </p>
                    </CardContent>
                  </Card>

                  <Button variant="ghost" onClick={handleReset} className="w-full">
                    Задать новый вопрос
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentSheet
        open={showPayment}
        type="yes-no"
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
