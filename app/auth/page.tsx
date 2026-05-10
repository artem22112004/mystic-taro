"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mail, Check } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSend = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mystical-gradient px-4 pt-8 pb-10 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/">
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1">
            <ChevronLeft size={20} />
          </button>
        </Link>
      </div>

      <div className="flex flex-col items-center text-center gap-2 mb-10">
        <span className="text-gold text-4xl">☽</span>
        <h1 className="font-heading text-gold text-2xl tracking-wide">Войти</h1>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          Укажи email — мы пришлём ссылку для входа. Никакого пароля.
        </p>
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!sent ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="твой@email.ru"
              className="w-full rounded-xl bg-card border border-white/[0.08] px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-colors"
              autoComplete="email"
              autoFocus
            />

            <Button
              className="w-full"
              onClick={handleSend}
              disabled={!isValid || loading}
            >
              {loading ? (
                "Отправляю..."
              ) : (
                <>
                  <Mail size={16} />
                  Прислать ссылку
                </>
              )}
            </Button>

            <p className="text-muted-foreground text-xs text-center">
              Входя, ты принимаешь условия использования сервиса
            </p>
          </>
        ) : (
          <motion.div
            className="flex flex-col items-center gap-4 py-6 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
              <Check size={24} className="text-gold" />
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Ссылка отправлена</p>
              <p className="text-muted-foreground text-sm">
                Проверь почту{" "}
                <span className="text-gold">{email}</span>
                {" "}и перейди по ссылке
              </p>
            </div>
            <button
              className="text-muted-foreground text-sm hover:text-foreground transition-colors"
              onClick={() => setSent(false)}
            >
              Изменить email
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
