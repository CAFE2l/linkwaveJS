"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LinkForm } from "@/components/dashboard/link-form";
import { Button } from "@/components/ui/button";
import type { Link } from "@/types/database";

export function EditLinkModal({
  link,
  open,
  onClose,
  onToast,
}: {
  link: Link | null;
  open: boolean;
  onClose: () => void;
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
            className="glass-strong w-full max-w-md rounded-[1.75rem] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">Editar link</h3>
              <button
                onClick={onClose}
                className="flex size-9 items-center justify-center rounded-xl text-muted transition hover:bg-white/30 hover:text-foreground dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5">
              <LinkForm link={link} onSaved={onClose} onToast={onToast} />
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
            className="glass-strong w-full max-w-sm rounded-[1.75rem] p-6 shadow-2xl"
          >
            <h3 className="text-lg font-black">Excluir link</h3>
            <p className="mt-2 text-sm font-medium text-muted">
              Tem certeza que deseja excluir &ldquo;{link?.title}&rdquo;? Esta
              ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={pending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={onConfirm}
                disabled={pending}
                className="!border-red-400/40 !text-red-500 hover:!bg-red-500/10 dark:!border-red-400/20"
              >
                {pending ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
