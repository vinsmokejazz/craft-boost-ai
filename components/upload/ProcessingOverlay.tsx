"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, type ProcessingPhase } from "@/store/useAppStore";

/**
 * Maps each processing phase to a user-friendly label.
 */
const phaseLabels: Record<ProcessingPhase, string> = {
  idle: "",
  uploading: "Uploading your craft photo…",
  removing_bg: "Removing background with AI precision…",
  generating_scene: "Generating a stunning lifestyle scene…",
  writing_copy: "Crafting SEO-optimized marketing copy…",
  done: "All done! Preparing your results…",
};

const phaseProgress: Record<ProcessingPhase, number> = {
  idle: 0,
  uploading: 10,
  removing_bg: 30,
  generating_scene: 60,
  writing_copy: 85,
  done: 100,
};

/**
 * A glassmorphic full-overlay that appears when processingPhase !== 'idle'.
 * Shows a "scanning laser" animation over the image preview
 * and dynamically updates status text based on the Zustand store.
 */
export default function ProcessingOverlay() {
  const processingPhase = useAppStore((s) => s.processingPhase);
  const isActive = processingPhase !== "idle";

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden rounded-2xl"
        >
          {/* Glass backdrop */}
          <div className="absolute inset-0 bg-background/70 backdrop-blur-xl" />

          {/* Scanning laser line */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 animate-scan-line"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, var(--accent-bright) 30%, var(--accent) 50%, var(--accent-bright) 70%, transparent 100%)",
              boxShadow: "0 0 30px 6px rgba(167, 139, 250, 0.5)",
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Corner markers */}
          {[
            "top-3 left-3",
            "top-3 right-3 rotate-90",
            "bottom-3 right-3 rotate-180",
            "bottom-3 left-3 -rotate-90",
          ].map((pos) => (
            <div
              key={pos}
              className={`absolute ${pos} h-5 w-5 border-l-2 border-t-2 border-accent/60`}
            />
          ))}

          {/* Centered content */}
          <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
            {/* Animated ring */}
            <div className="relative flex h-20 w-20 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-accent/30"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-1 rounded-full border-2 border-transparent border-t-accent-bright"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              {/* Inner glow */}
              <div className="h-8 w-8 rounded-full bg-accent/20 animate-pulse-glow" />
            </div>

            {/* Dynamic phase text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={processingPhase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-sm font-medium text-accent-bright"
              >
                {phaseLabels[processingPhase]}
              </motion.p>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="w-56 h-1 overflow-hidden rounded-full bg-white/6">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-accent-dim to-accent-bright"
                initial={{ width: "0%" }}
                animate={{
                  width: `${phaseProgress[processingPhase]}%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            <p className="text-xs text-white/30">
              This may take 15–30 seconds
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
