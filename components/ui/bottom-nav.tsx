"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", icon: Home, label: "Главная" },
  { href: "/spread/yes-no", icon: Sparkles, label: "Расклады" },
  { href: "/history", icon: Clock, label: "История" },
  { href: "/profile", icon: User, label: "Профиль" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-card/95 backdrop-blur-md border-t border-white/[0.08]">
      <div className="flex max-w-lg mx-auto">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors duration-150",
                isActive ? "text-gold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.5}
                className="transition-all duration-150"
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
