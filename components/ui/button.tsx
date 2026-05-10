"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 select-none disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Золотая — главный CTA */
        primary:
          "bg-gold text-background font-semibold shadow-lg hover:bg-gold-light hover:shadow-[0_0_24px_rgba(212,175,55,0.5)] active:bg-gold-dark",

        /* Прозрачная с золотой обводкой */
        ghost:
          "border border-gold/40 text-gold bg-transparent hover:bg-gold/8 hover:border-gold/70 hover:shadow-[0_0_16px_rgba(212,175,55,0.2)]",

        /* Фиолетовое свечение — акцентная/мистическая */
        mystical:
          "bg-mystic/20 border border-mystic/50 text-foreground hover:bg-mystic/30 hover:border-mystic hover:shadow-[0_0_24px_rgba(106,13,173,0.4)] relative overflow-hidden before:absolute before:inset-0 before:bg-gold-shimmer before:animate-shimmer before:opacity-0 hover:before:opacity-100",

        /* Деструктивная */
        destructive:
          "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-13 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
