"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomSheet } from "./bottom-sheet";
import { Button } from "./button";
import { Check, ShieldCheck, Loader2 } from "lucide-react";
import { markPaid, SPREAD_PRICES, type PaidSpreadType } from "@/lib/payment";

const SPREAD_NAMES: Record<PaidSpreadType, string> = {
  "yes-no": "Да или Нет",
  relationship: "На отношения",
};

const SPREAD_DESC: Record<PaidSpreadType, string> = {
  "yes-no": "Одна карта · мгновенный ответ · трактовка",
  relationship: "Пять карт · анализ энергий · общий вывод",
};

interface PaymentSheetProps {
  open: boolean;
  type: PaidSpreadType;
  onClose: () => void;
  onSuccess: () => void;
}

type PayPhase = "idle" | "processing" | "done";

export function PaymentSheet({ open, type, onClose, onSuccess }: PaymentSheetProps) {
  const [phase, setPhase] = useState<PayPhase>("idle");
  const price = SPREAD_PRICES[type];

  const handlePay = async () => {
    setPhase("processing");
    await new Promise((r) => setTimeout(r, 1600));
    markPaid(type);
    setPhase("done");
    await new Promise((r) => setTimeout(r, 900));
    onSuccess();
    setPhase("idle");
  };

  const handleClose = () => {
    if (phase !== "idle") return;
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={handleClose} height={62}>
      <div className="px-5 pt-2 pb-6 flex flex-col gap-5">
        {/* Заголовок */}
        <div className="text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Расклад</p>
          <h2 className="font-heading text-gold text-xl">{SPREAD_NAMES[type]}</h2>
          <p className="text-muted-foreground text-sm mt-1">{SPREAD_DESC[type]}</p>
        </div>

        {/* Цена */}
        <div className="bg-background/60 rounded-2xl border border-gold/20 px-5 py-4 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">К оплате</span>
          <span className="font-heading text-gold text-2xl">{price} ₽</span>
        </div>

        {/* Кнопка оплаты */}
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Button className="w-full text-base py-4" onClick={handlePay}>
                Оплатить {price} ₽
              </Button>
            </motion.div>
          )}

          {phase === "processing" && (
            <motion.div
              key="processing"
              className="flex flex-col items-center gap-3 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 size={28} className="animate-spin text-gold" />
              <p className="text-muted-foreground text-sm">Обрабатываем платёж...</p>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              className="flex flex-col items-center gap-3 py-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                <Check size={22} className="text-gold" />
              </div>
              <p className="text-foreground font-medium">Оплачено</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Безопасность */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <ShieldCheck size={14} />
          <p className="text-xs">Безопасная оплата · данные защищены</p>
        </div>

        {phase === "idle" && (
          <button
            onClick={handleClose}
            className="text-muted-foreground text-sm text-center hover:text-foreground transition-colors"
          >
            Отмена
          </button>
        )}
      </div>
    </BottomSheet>
  );
}
