"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useAppStore, type Toast } from "@/store/useAppStore";

const icons: Record<Toast["type"], typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const colors: Record<Toast["type"], string> = {
  success: "text-success border-success/20 bg-success/5",
  error: "text-danger border-danger/20 bg-danger/5",
  info: "text-accent-bright border-accent/20 bg-accent/5",
};

export default function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);
  const removeToast = useAppStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`glass flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${colors[toast.type]}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="max-w-xs">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 shrink-0 rounded p-0.5 opacity-60 transition hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
