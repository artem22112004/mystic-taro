# Мистические расклады — AI Таро

PWA-приложение для AI-раскладов таро на русском языке. Аудитория — RU/СНГ.

## Стек

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Framer Motion** — анимации карт
- **Supabase** — авторизация и база данных
- **OpenAI** (gpt-4o-mini) — генерация трактовок
- **@ducanh2912/next-pwa** — PWA-функционал
- **Vercel** — деплой

## Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone <repo-url>
cd <repo-name>

# 2. Установить зависимости
npm install

# 3. Настроить переменные окружения
cp .env.example .env.local
# Заполнить .env.local своими ключами

# 4. Запустить в режиме разработки
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

## Переменные окружения

| Переменная | Описание |
|---|---|
| `OPENAI_API_KEY` | Ключ OpenAI API |
| `NEXT_PUBLIC_SUPABASE_URL` | URL проекта Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Публичный ключ Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Серверный ключ Supabase (только на сервере) |
| `YOKASSA_SHOP_ID` | ID магазина ЮKassa (позже) |
| `YOKASSA_SECRET_KEY` | Секретный ключ ЮKassa (позже) |

## Структура проекта

```
app/           — страницы (App Router)
  api/         — API-роуты
  spread/      — страницы раскладов
components/    — React-компоненты
  ui/          — базовые UI-компоненты (shadcn + кастомные)
lib/           — утилиты: openai, supabase, tarot, prompts
data/          — данные колоды (78 карт)
types/         — TypeScript-типы
hooks/         — кастомные хуки
public/        — статика, иконки PWA, manifest.json
research/      — ресёрч конкурентов (Phase 1)
```

## Фазы разработки

- [x] Фаза 1: Ресёрч конкурентов
- [x] Фаза 2: Настройка проекта
- [ ] Фаза 3: Дизайн-система
- [ ] Фаза 4: Данные таро (78 карт)
- [ ] Фаза 5: AI-интеграция (OpenAI)
- [ ] Фаза 6: Страницы и UX
- [ ] Фаза 7: База данных и авторизация (Supabase)
- [ ] Фаза 8: Платежи (заглушка → ЮKassa)
- [ ] Фаза 9: Полировка и деплой на Vercel

## Деплой

```bash
npm run build   # проверить сборку локально
```

Деплой — через Vercel. При пуше в `main` деплой запускается автоматически.
