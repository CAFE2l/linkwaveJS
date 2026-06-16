"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export function UsernameAvailability({
  checking,
  message,
  available,
}: {
  checking: boolean;
  message: string;
  available: boolean | null;
}) {
  if (!checking && !message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1.5 flex items-center gap-1.5 text-xs"
      aria-live="polite"
    >
      {checking ? (
        <>
          <Loader2 className="size-3 animate-spin text-muted-foreground" />
          <span className="text-muted">Verificando username...</span>
        </>
      ) : available ? (
        <>
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {message}
          </span>
        </>
      ) : (
        <>
          <XCircle className="size-3.5 text-red-500" />
          <span className="font-medium text-red-600 dark:text-red-400">
            {message}
          </span>
        </>
      )}
    </motion.p>
  );
}
