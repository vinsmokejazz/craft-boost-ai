"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles, Wand2, Type } from "lucide-react";

const steps = [
  { icon: Loader2, label: "Removing background…", spin: true },
  { icon: Wand2, label: "Generating lifestyle scene…", spin: false },
  { icon: Type, label: "Crafting marketing copy…", spin: false },
  { icon: Sparkles, label: "Polishing results…", spin: false },
];

interface ProcessingCardProps {
  /** 0-based index of the current step */
  currentStep: number;
}

export default function ProcessingCard({ currentStep }: Readonly<ProcessingCardProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent-bright/80">
        AI Processing
      </h3>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;

          let stepClass = "text-white/25";
          if (isActive) {
            stepClass = "bg-accent/10 text-accent-bright";
          } else if (isDone) {
            stepClass = "text-success/70";
          }

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${stepClass}`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive && step.spin ? "animate-spin" : ""
                }`}
              />
              <span>{step.label}</span>
              {isDone && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto text-xs text-success"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Mini progress bar */}
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/6">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-accent-dim to-accent-bright"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
