"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Sun, HelpCircle, Heart, ChevronRight } from "lucide-react";

const STORAGE_KEY = "mystic_onboarded";

const SLIDES = [
  {
    id: 0,
    symbol: "☽",
    title: "Мистические расклады",
    subtitle: "AI-таролог, который говорит прямо — без воды и туманных фраз",
  },
  {
    id: 1,
    symbol: null,
    title: "Что умеет приложение",
    subtitle: null,
    features: [
      {
        Icon: Sun,
        color: "text-gold",
        bg: "bg-gold/10",
        name: "Карта дня",
        desc: "Каждый день — новая карта и её трактовка. Бесплатно.",
      },
      {
        Icon: HelpCircle,
        color: "text-mystic-light",
        bg: "bg-mystic/20",
        name: "Да или Нет",
        desc: "Один вопрос — один чёткий ответ. 49 ₽",
      },
      {
        Icon: Heart,
        color: "text-rose-400",
        bg: "bg-rose-400/10",
        name: "На отношения",
        desc: "Пять карт раскроют энергию ситуации. 199 ₽",
      },
    ],
  },
  {
    id: 2,
    symbol: "✦",
    title: "Готова начать?",
    subtitle: "Карта дня — бесплатно. Каждое утро.",
  },
];

interface OnboardingProps {
  onDone?: () => void;
}

export function Onboarding({ onDone }: OnboardingProps) {
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    onDone?.();
  };

  const next = () => {
    if (slide < SLIDES.length - 1) {
      setSlide((s) => s + 1);
    } else {
      finish();
    }
  };

  if (!visible) return null;

  const current = SLIDES[slide];

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Skip */}
      <div className="flex justify-end px-5 pt-5">
        <button
          onClick={finish}
          className="text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          Пропустить
        </button>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            className="flex flex-col items-center gap-6 w-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
          >
            {current.symbol && (
              <span className="text-gold text-6xl leading-none">{current.symbol}</span>
            )}

            <div className="space-y-3">
              <h1 className="font-heading text-gold text-2xl tracking-wide leading-snug">
                {current.title}
              </h1>
              {current.subtitle && (
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {current.subtitle}
                </p>
              )}
            </div>

            {current.features && (
              <div className="w-full space-y-3 mt-2">
                {current.features.map(({ Icon, color, bg, name, desc }) => (
                  <div
                    key={name}
                    className="flex items-start gap-4 bg-card rounded-2xl border border-white/[0.06] px-4 py-3.5 text-left"
                  >
                    <div className={`shrink-0 w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon size={18} className={color} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-5 pb-10 space-y-5">
        {/* Dots */}
        <div className="flex justify-center gap-1.5">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === slide ? "w-6 bg-gold" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>

        <Button className="w-full" onClick={next}>
          {slide < SLIDES.length - 1 ? (
            <>
              Далее
              <ChevronRight size={16} />
            </>
          ) : (
            "Открыть расклад"
          )}
        </Button>
      </div>
    </div>
  );
}
