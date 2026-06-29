"use client";

import { type ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";

export function CustomizeAccordion({
  icon: Icon,
  title,
  description,
  progress,
  defaultOpen = true,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  progress?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="glass-card-strong overflow-hidden p-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
      >
        <span className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/55 text-ocean shadow-sm backdrop-blur-xl">
            <Icon size={18} />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black text-ocean">{title}</span>
            <span className="mt-0.5 block text-sm font-semibold text-ocean/70">{description}</span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {progress && (
            <span className="hidden rounded-full border border-cyan-200/70 bg-white/45 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-ocean/70 sm:inline-flex">
              {progress}
            </span>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex size-9 items-center justify-center rounded-full border border-white/70 bg-white/35 text-ocean shadow-sm backdrop-blur-xl"
          >
            <ChevronDown size={17} />
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/35"
          >
            <motion.div
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              exit={{ y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="px-5 py-5 sm:px-7 sm:py-6"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
