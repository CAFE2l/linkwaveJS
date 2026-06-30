"use client";

import { memo, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Layers3, Sparkles, X } from "lucide-react";
import { CustomizePreview } from "./preview";
import { useCustomizeStore } from "./customize-store";
import type { AppUser, Link } from "@/types/database";

type LivePreviewPanelProps = {
  user: AppUser;
  links: Link[];
  bio: string;
  status: "idle" | "saving" | "saved" | "error";
};

const PreviewFrame = memo(function PreviewFrame({
  user,
  links,
  bio,
  status,
}: LivePreviewPanelProps) {
  const theme = useCustomizeStore((state) => state.theme);
  const previewLinks = useMemo<Link[]>(
    () =>
      links.length > 0
        ? links.slice(0, 3)
        : [
            {
              id: "preview-portfolio",
              user_id: user.id,
              title: "Meu portfólio",
              url: "https://example.com/portfolio",
              icon: "link",
              icone: null,
              icon_blob: null,
              is_custom_icon: false,
              pinned: false,
              order_position: 0,
              created_at: "",
            },
            {
              id: "preview-social",
              user_id: user.id,
              title: "Minhas redes",
              url: "https://example.com/social",
              icon: "link",
              icone: null,
              icon_blob: null,
              is_custom_icon: false,
              pinned: false,
              order_position: 1,
              created_at: "",
            },
          ],
    [links, user.id],
  );
  const statusLabel =
    status === "saving" ? "Salvando" : status === "saved" ? "Salvo" : status === "error" ? "Erro" : "Ao vivo";

  return (
    <motion.div
      layout
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/75 bg-white/30 p-3 shadow-2xl shadow-cyan-950/15 backdrop-blur-2xl"
    >
        <div className="mb-3 flex items-center justify-between gap-3 px-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-black text-ocean">
              <Sparkles size={15} />
              Preview ao vivo
            </div>
            <p className="mt-0.5 text-xs font-semibold text-ocean/65">
              Atualiza antes de salvar.
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-100/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            {statusLabel}
          </span>
        </div>
        <CustomizePreview user={user} links={previewLinks} theme={theme} bio={bio} />
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/55 bg-white/25 px-3 py-2 text-xs font-semibold text-ocean/65">
          <Layers3 size={14} className="shrink-0" />
          Use este mockup para validar fundo, cards, LEDs e transições em tempo real.
        </div>
    </motion.div>
  );
});

export function LivePreviewPanel(props: LivePreviewPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="sticky top-24 hidden lg:block">
        <PreviewFrame {...props} />
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="glass-button fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 text-sm lg:hidden"
        aria-haspopup="dialog"
      >
        <Eye size={17} />
        Ver preview
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end bg-ocean/35 p-2 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Preview ao vivo"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-h-[94dvh] w-full overflow-y-auto rounded-[2rem] bg-cyan-50/85 p-2 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex justify-end p-2">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex size-10 items-center justify-center rounded-full border border-white/80 bg-white/70 text-ocean shadow-lg"
                  aria-label="Fechar preview"
                >
                  <X size={18} />
                </button>
              </div>
              <PreviewFrame {...props} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
