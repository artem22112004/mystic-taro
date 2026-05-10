"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  return (
    <div className="px-4 pt-12 pb-6">
      <h1 className="font-heading text-gold text-2xl tracking-wide mb-2">
        История раскладов
      </h1>
      <p className="text-muted-foreground text-sm mb-10">
        Все твои расклады хранятся здесь
      </p>

      <motion.div
        className="flex flex-col items-center gap-5 py-10 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-full bg-card border border-white/[0.08] flex items-center justify-center">
          <Lock size={24} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-foreground font-medium mb-1">
            Нужна авторизация
          </p>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
            Войди, чтобы расклады сохранялись и были доступны с любого устройства
          </p>
        </div>
        <Link href="/auth">
          <Button variant="primary">Войти</Button>
        </Link>
      </motion.div>
    </div>
  );
}
