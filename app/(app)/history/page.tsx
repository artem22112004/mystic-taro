"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, Sun, Heart, HelpCircle, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Reading = Database["public"]["Tables"]["readings"]["Row"];

const TYPE_META: Record<string, { label: string; Icon: React.ElementType; color: string }> = {
  daily: { label: "Карта дня", Icon: Sun, color: "text-gold" },
  "yes-no": { label: "Да или нет", Icon: HelpCircle, color: "text-mystic" },
  relationship: { label: "На отношения", Icon: Heart, color: "text-rose-400" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getPreview(reading: Reading): string {
  if (reading.question) return reading.question;
  const interp = reading.interpretation as Record<string, unknown> | null;
  if (!interp) return "";
  if (typeof interp.text === "string") return interp.text.slice(0, 80);
  if (typeof interp.conclusion === "string") return interp.conclusion.slice(0, 80);
  return "";
}

export default function HistoryPage() {
  const { user, loading: userLoading } = useUser();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("readings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setReadings(data ?? []);
        setLoading(false);
      });
  }, [user]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }

  return (
    <div className="px-4 pt-12 pb-6">
      <h1 className="font-heading text-gold text-2xl tracking-wide mb-2">
        История раскладов
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Все твои расклады хранятся здесь
      </p>

      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="locked"
            className="flex flex-col items-center gap-5 py-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 rounded-full bg-card border border-white/[0.08] flex items-center justify-center">
              <Lock size={24} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-foreground font-medium mb-1">Нужна авторизация</p>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Войди, чтобы расклады сохранялись и были доступны с любого устройства
              </p>
            </div>
            <Link href="/auth">
              <Button variant="primary">Войти</Button>
            </Link>
          </motion.div>
        ) : loading ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="animate-spin text-gold" size={28} />
          </motion.div>
        ) : readings.length === 0 ? (
          <motion.div
            key="empty"
            className="flex flex-col items-center gap-4 py-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-4xl">☽</span>
            <p className="text-foreground font-medium">Раскладов пока нет</p>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Сделай первый расклад — и он появится здесь
            </p>
            <Link href="/spread/yes-no">
              <Button variant="ghost">Сделать расклад</Button>
            </Link>
          </motion.div>
        ) : (
          <motion.ul
            key="list"
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {readings.map((reading, i) => {
              const meta = TYPE_META[reading.type] ?? {
                label: reading.type,
                Icon: HelpCircle,
                color: "text-muted-foreground",
              };
              const preview = getPreview(reading);
              return (
                <motion.li
                  key={reading.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-3 bg-card rounded-2xl border border-white/[0.06] px-4 py-3.5">
                    <div className={`shrink-0 ${meta.color}`}>
                      <meta.Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-medium text-foreground">
                          {meta.label}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDate(reading.created_at)}
                        </span>
                      </div>
                      {preview && (
                        <p className="text-xs text-muted-foreground truncate">
                          {preview}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
