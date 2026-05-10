"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, LogIn } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="px-4 pt-12 pb-6 space-y-6">
      <h1 className="font-heading text-gold text-2xl tracking-wide">Профиль</h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Аватар-заглушка */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-20 h-20 rounded-full bg-card border border-white/[0.08] flex items-center justify-center">
            <User size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">Ты не авторизована</p>
        </div>

        <Card>
          <CardContent className="pt-4 pb-4 space-y-1">
            <p className="text-foreground font-medium text-sm">После авторизации:</p>
            {[
              "История всех раскладов",
              "Карта дня запоминается на 24 часа",
              "Доступ с любого устройства",
            ].map((item) => (
              <p key={item} className="text-muted-foreground text-sm flex gap-2">
                <span className="text-gold">✦</span>
                {item}
              </p>
            ))}
          </CardContent>
        </Card>

        <Link href="/auth">
          <Button className="w-full" variant="primary">
            <LogIn size={16} />
            Войти через email
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
