"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LinkForm } from "@/components/dashboard/link-form";
import type { Link } from "@/types/database";

export function EditLinkModal({
  link,
  open,
  onClose,
  onSaved,
  onToast,
}: {
  link: Link | null;
  open: boolean;
  onClose: () => void;
  onSaved?: (link?: Link) => void;
  onToast?: (message: string, type?: "success" | "error") => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!link) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glass-card-strong w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-ocean">Editar link</h3>
              <button
                onClick={onClose}
                className="flex size-9 items-center justify-center rounded-xl text-ocean/60 transition hover:text-ocean hover:bg-white/30"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5">
              <LinkForm link={link} onSaved={(updated) => { onSaved?.(updated); onClose(); }} onToast={onToast} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DeleteLinkModal({
  link,
  open,
  onClose,
  onConfirm,
  pending,
}: {
  link: Link | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pending: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glass-card-strong w-full max-w-sm p-6"
          >
            <h3 className="text-lg font-black text-ocean">Excluir link</h3>
            <p className="mt-2 text-sm font-bold text-ocean/70">
              Tem certeza que deseja excluir &ldquo;{link?.title}&rdquo;? Esta
              ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={pending}
                className="px-5 py-2 rounded-xl border border-white/70 bg-white/40 text-ocean font-bold text-sm backdrop-blur-md transition hover:bg-white/60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={pending}
                className="px-5 py-2 rounded-xl bg-gradient-to-b from-red-400 to-red-500 text-white font-bold text-sm shadow-lg shadow-red-300/30 transition hover:from-red-300 hover:to-red-400 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
              >
                {pending ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
