"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import googleIcon from "/public/imgs/icons/links/Google.png";

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
      className="relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-white/20 bg-gradient-to-b from-white/20 to-white/5 px-5 text-sm font-semibold text-foreground shadow-lg shadow-black/5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/8 dark:from-white/8 dark:to-white/3"
    >
      <div className="pointer-events-none absolute inset-x-[15%] top-0 h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Image src={googleIcon} alt="" width={20} height={20} className="size-5" />
      )}
      <span>Continuar com Google</span>
    </motion.button>
  );
}
