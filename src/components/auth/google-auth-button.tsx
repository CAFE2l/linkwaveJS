"use client";

import { motion } from "framer-motion";
import { Chrome, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleAuthButton() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleAuth() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      setLoading(false);
    }
  }

  return (
    <motion.button
      type="button"
      disabled={loading}
      onClick={handleGoogleAuth}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-white/55 px-5 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition-all hover:bg-white/80 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/8 dark:hover:bg-white/12"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Chrome className="size-4" />
      )}
      <span>Continuar com Google</span>
    </motion.button>
  );
}
