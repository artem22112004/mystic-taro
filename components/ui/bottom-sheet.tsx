"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Высота шторки в vh, по умолчанию 70 */
  height?: number;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
  height = 70,
}: BottomSheetProps) {
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            key="sheet"
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) onClose();
            }}
            className={cn(
              "fixed bottom-0 inset-x-0 z-50 rounded-t-3xl border-t border-x border-white/10 bg-card shadow-[0_-8px_48px_rgba(0,0,0,0.5)] glow-purple overflow-hidden",
              className
            )}
            style={{ height: `${height}vh` }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
          >
            {/* Drag handle */}
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {title && (
              <div className="px-5 pb-4 border-b border-white/8">
                <h2 className="font-heading text-gold text-lg tracking-wide text-center">
                  {title}
                </h2>
              </div>
            )}

            <div className="overflow-y-auto h-full pb-8">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
