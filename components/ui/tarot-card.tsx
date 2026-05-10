"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TarotCardProps {
  name: string;
  nameEn?: string;
  image?: string;
  isReversed?: boolean;
  isFlipped?: boolean;
  onClick?: () => void;
  className?: string;
  /** Размер карты: sm = 120×200, md = 160×270, lg = 200×340 */
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { w: 120, h: 200, text: "text-xs" },
  md: { w: 160, h: 270, text: "text-sm" },
  lg: { w: 200, h: 340, text: "text-base" },
};

export function TarotCard({
  name,
  nameEn,
  image,
  isReversed = false,
  isFlipped = false,
  onClick,
  className,
  size = "md",
}: TarotCardProps) {
  const { w, h, text } = sizeMap[size];

  return (
    <div
      className={cn("cursor-pointer select-none", className)}
      style={{ width: w, height: h, perspective: "1000px" }}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Рубашка (задняя сторона) */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-gold/30 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardBack />
        </div>

        {/* Лицевая сторона */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-gold/50 shadow-[0_4px_24px_rgba(212,175,55,0.2)]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardFront
            name={name}
            nameEn={nameEn}
            image={image}
            isReversed={isReversed}
            textSize={text}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ── Рубашка ─────────────────────────────────────────────── */
function CardBack() {
  return (
    <div className="w-full h-full bg-card-back flex items-center justify-center relative">
      {/* Фоновый узор */}
      <div className="absolute inset-3 rounded-xl border border-gold/20" />
      <div className="absolute inset-5 rounded-lg border border-gold/10" />

      {/* Центральный символ */}
      <div className="flex flex-col items-center gap-1 z-10">
        <span className="text-gold/70 text-4xl leading-none select-none">
          ☽
        </span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-gold/40 text-xs">
              ✦
            </span>
          ))}
        </div>
      </div>

      {/* Угловые звёзды */}
      {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map(
        (pos) => (
          <span key={pos} className={`absolute ${pos} text-gold/30 text-xs`}>
            ✦
          </span>
        )
      )}
    </div>
  );
}

/* ── Лицевая сторона ─────────────────────────────────────── */
function CardFront({
  name,
  nameEn,
  image,
  isReversed,
  textSize,
}: {
  name: string;
  nameEn?: string;
  image?: string;
  isReversed: boolean;
  textSize: string;
}) {
  return (
    <div
      className="w-full h-full bg-card relative flex flex-col"
      style={{ transform: isReversed ? "rotate(180deg)" : "none" }}
    >
      {/* Картинка */}
      <div className="flex-1 relative overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <PlaceholderArt name={name} />
        )}
      </div>

      {/* Подпись */}
      <div className="px-2 py-2 bg-background/80 backdrop-blur-sm text-center">
        <p className={cn("font-heading text-gold leading-tight truncate", textSize)}>
          {name}
        </p>
        {nameEn && (
          <p className="text-muted-foreground text-[10px] truncate mt-0.5">
            {nameEn}
          </p>
        )}
      </div>

      {/* Перевёрнута — метка */}
      {isReversed && (
        <div
          className="absolute top-1.5 right-1.5 bg-mystic/80 text-[9px] text-white px-1.5 py-0.5 rounded-full"
          style={{ transform: "rotate(180deg)" }}
        >
          перев.
        </div>
      )}
    </div>
  );
}

/* ── Заглушка без изображения ────────────────────────────── */
function PlaceholderArt({ name }: { name: string }) {
  const firstChar = name.charAt(0).toUpperCase();
  return (
    <div className="w-full h-full bg-mystical-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl text-gold/30 font-heading mb-2">{firstChar}</div>
        <div className="w-8 h-px bg-gold/20 mx-auto" />
      </div>
    </div>
  );
}
