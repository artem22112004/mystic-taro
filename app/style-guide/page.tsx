"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { TarotCard } from "@/components/ui/tarot-card";
import { Sparkles, Moon, Heart } from "lucide-react";

export default function StyleGuidePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) =>
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-background px-4 py-10 max-w-lg mx-auto space-y-12">

      {/* ── Заголовок ──────────────────────────────────────── */}
      <section>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-4">
          Style Guide
        </p>
        <h1 className="font-heading text-gold text-4xl mb-2">
          Мистические расклады
        </h1>
        <p className="text-muted-foreground text-sm">
          Дизайн-система приложения. Только для внутреннего использования.
        </p>
      </section>

      {/* ── Типографика ────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle>Типографика</SectionTitle>
        <h1 className="font-heading text-gold text-4xl">Cinzel — заголовок H1</h1>
        <h2 className="font-heading text-gold/80 text-2xl">Cinzel — заголовок H2</h2>
        <h3 className="font-heading text-gold/60 text-xl">Cinzel — заголовок H3</h3>
        <p className="text-foreground text-base">
          Manrope — основной текст. Здесь будет трактовка карты, описание расклада
          и всё, что пользователь читает в процессе.
        </p>
        <p className="text-muted-foreground text-sm">
          Приглушённый текст — подписи, метаданные, даты раскладов.
        </p>
      </section>

      {/* ── Цвета ──────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionTitle>Цвета</SectionTitle>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Background", css: "bg-background", border: true },
            { label: "Card", css: "bg-card", border: true },
            { label: "Gold", css: "bg-gold" },
            { label: "Gold Light", css: "bg-gold-light" },
            { label: "Mystic", css: "bg-mystic" },
            { label: "Mystic Light", css: "bg-mystic-light" },
            { label: "Muted", css: "bg-muted" },
            { label: "Destructive", css: "bg-destructive" },
          ].map(({ label, css, border }) => (
            <div key={label} className="space-y-1">
              <div
                className={`h-12 rounded-xl ${css} ${border ? "border border-white/10" : ""}`}
              />
              <p className="text-[10px] text-muted-foreground text-center leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Кнопки ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle>Кнопки</SectionTitle>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">primary — основной CTA</p>
            <Button variant="primary" className="w-full">
              <Sparkles size={16} />
              Получить расклад
            </Button>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">ghost — вторичное действие</p>
            <Button variant="ghost" className="w-full">
              <Moon size={16} />
              Посмотреть историю
            </Button>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              mystical — акцент, особые действия
            </p>
            <Button variant="mystical" className="w-full">
              <Heart size={16} />
              Расклад на отношения
            </Button>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">size sm</p>
            <div className="flex gap-2">
              <Button size="sm" variant="primary">Маленькая</Button>
              <Button size="sm" variant="ghost">Маленькая</Button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">disabled</p>
            <Button disabled className="w-full">Недоступно</Button>
          </div>
        </div>
      </section>

      {/* ── Карточки ───────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle>Card</SectionTitle>

        <Card>
          <CardHeader>
            <CardTitle>Карта дня</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Сегодня Луна указывает на время для внутреннего диалога.
              Прислушайся к тому, что давно хотело быть услышанным.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="ghost">Подробнее</Button>
          </CardFooter>
        </Card>

        <Card className="border-gold/30">
          <CardHeader>
            <CardTitle>Расклад на отношения</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              5 карт · Позиции: вы, партнёр, прошлое, настоящее, будущее
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="primary">199 ₽</Button>
          </CardFooter>
        </Card>
      </section>

      {/* ── Карты Таро ─────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle>TarotCard</SectionTitle>
        <p className="text-xs text-muted-foreground">
          Нажми на карту, чтобы перевернуть
        </p>

        <div className="flex gap-4 flex-wrap">
          <div className="space-y-1">
            <TarotCard
              name="Луна"
              nameEn="The Moon"
              isFlipped={flippedCards["moon"]}
              onClick={() => toggleCard("moon")}
              size="md"
            />
            <p className="text-[10px] text-muted-foreground text-center">обычная</p>
          </div>

          <div className="space-y-1">
            <TarotCard
              name="Солнце"
              nameEn="The Sun"
              isReversed
              isFlipped={flippedCards["sun"]}
              onClick={() => toggleCard("sun")}
              size="md"
            />
            <p className="text-[10px] text-muted-foreground text-center">перевёрнутая</p>
          </div>

          <div className="space-y-1">
            <TarotCard
              name="Шут"
              nameEn="The Fool"
              isFlipped={flippedCards["fool"]}
              onClick={() => toggleCard("fool")}
              size="sm"
            />
            <p className="text-[10px] text-muted-foreground text-center">sm</p>
          </div>
        </div>
      </section>

      {/* ── Modal ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle>Modal</SectionTitle>
        <Button variant="ghost" onClick={() => setModalOpen(true)} className="w-full">
          Открыть Modal
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Трактовка карты"
        >
          <p className="text-muted-foreground text-sm leading-relaxed">
            Луна — карта тайн и подсознания. Сейчас ты находишься в периоде,
            когда многое происходит за пределами видимого. Доверяй ощущениям,
            а не только логике.
          </p>
          <Button className="w-full mt-4" onClick={() => setModalOpen(false)}>
            Понятно
          </Button>
        </Modal>
      </section>

      {/* ── BottomSheet ────────────────────────────────────── */}
      <section className="space-y-4 pb-20">
        <SectionTitle>BottomSheet</SectionTitle>
        <Button variant="ghost" onClick={() => setSheetOpen(true)} className="w-full">
          Открыть BottomSheet
        </Button>
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="История раскладов"
          height={60}
        >
          <div className="p-5 space-y-3">
            {["Карта дня · вчера", "Да/Нет · 3 дня назад", "Отношения · неделю назад"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/40"
                >
                  <Moon size={16} className="text-gold shrink-0" />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              )
            )}
          </div>
        </BottomSheet>
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-gold/80 text-base uppercase tracking-widest border-b border-white/8 pb-2">
      {children}
    </h2>
  );
}
