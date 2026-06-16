"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const checks = [
  { label: "8+ caracteres", test: (value: string) => value.length >= 8 },
  { label: "Maiúscula", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Minúscula", test: (value: string) => /[a-z]/.test(value) },
  { label: "Número", test: (value: string) => /[0-9]/.test(value) },
];

const labels = ["Muito fraca", "Fraca", "Boa", "Forte", "Excelente"];
const colors = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-emerald-400",
];

export function PasswordStrengthMeter({ password }: { password: string }) {
  const score = checks.filter((check) => check.test(password)).length;
  const width = `${(score / checks.length) * 100}%`;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{
        opacity: password ? 1 : 0,
        height: password ? "auto" : 0,
      }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="overflow-hidden"
      aria-live="polite"
    >
      <div className="mt-3 space-y-2">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/50 dark:bg-white/10">
          <motion.div
            className={`h-full rounded-full ${colors[score]}`}
            initial={{ width: 0 }}
            animate={{ width }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted">
            {password ? labels[score] : ""}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {checks.map((check) => {
            const passed = check.test(password);
            return (
              <div key={check.label} className="flex items-center gap-1.5">
                {passed ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <X className="size-3 text-muted-foreground" />
                )}
                <span
                  className={`text-xs ${
                    passed
                      ? "font-medium text-emerald-600 dark:text-emerald-400"
                      : "text-muted"
                  }`}
                >
                  {check.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
