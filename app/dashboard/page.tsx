"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  Type,
  Hash,
  Zap,
  Layers,
  Palette,
} from "lucide-react";
import DropZone from "@/components/upload/DropZone";
import ProcessingOverlay from "@/components/upload/ProcessingOverlay";
import ProcessingCard from "@/components/upload/ProcessingCard";
import ResultsDashboard from "@/components/results/ResultsDashboard";
import GallerySection from "@/components/gallery/GallerySection";
import SettingsSection from "@/components/settings/SettingsSection";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useProcessProduct } from "@/hooks";
import { useAppStore } from "@/store/useAppStore";
import type { SerializedPost } from "@/actions/productActions";

/* ── Animation variants ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const features = [
  {
    icon: Layers,
    title: "Background Removal",
    desc: "Instant AI-powered cutout with pixel-perfect edges.",
  },
  {
    icon: Palette,
    title: "Scene Generation",
    desc: "Place your craft in a stunning lifestyle environment.",
  },
  {
    icon: Type,
    title: "Marketing Copy",
    desc: "SEO-optimized descriptions and captions in seconds.",
  },
  {
    icon: Hash,
    title: "Smart Hashtags",
    desc: "Trend-aware tags tailored for your craft niche.",
  },
];

/* Phase → ProcessingCard step index mapping */
const phaseToStep: Record<string, number> = {
  uploading: 0,
  removing_bg: 0,
  writing_copy: 2,
  generating_scene: 1,
  done: 3,
};

export default function HomePage() {
  const activeSection = useAppStore((s) => s.activeSection);
  const processingPhase = useAppStore((s) => s.processingPhase);
  const setProcessingPhase = useAppStore((s) => s.setProcessingPhase);
  const addToast = useAppStore((s) => s.addToast);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [completedPost, setCompletedPost] = useState<SerializedPost | null>(
    null
  );

  const processProduct = useProcessProduct();
  const isProcessing = processProduct.isPending;

  /* Tick through processingPhase for the UI while API runs */
  useEffect(() => {
    if (!isProcessing) return;
    const phases: Array<[number, string]> = [
      [4000, "writing_copy"],
      [8000, "generating_scene"],
      [12000, "done"],
    ];
    const ids = phases.map(([ms, phase]) =>
      setTimeout(() => setProcessingPhase(phase as never), ms)
    );
    return () => ids.forEach(clearTimeout);
  }, [isProcessing, setProcessingPhase]);

  const handleFileAccepted = useCallback((file: File) => {
    setUploadedFile(file);
    setCompletedPost(null);
  }, []);

  const handleProcess = useCallback(() => {
    if (!uploadedFile) return;

    processProduct.mutate(uploadedFile, {
      onSuccess: (data) => {
        setCompletedPost(data);
        setUploadedFile(null);
        addToast({ type: "success", message: "Your craft has been boosted!" });
      },
      onError: (err) => {
        addToast({
          type: "error",
          message: err instanceof Error ? err.message : "Processing failed",
        });
      },
    });
  }, [uploadedFile, processProduct, addToast]);

  const handleReset = useCallback(() => {
    setUploadedFile(null);
    setCompletedPost(null);
  }, []);

  const currentStep = phaseToStep[processingPhase] ?? 0;

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {/* ────── UPLOAD SECTION ────── */}
        {activeSection === "upload" && (
          <motion.div key="upload" {...pageTransition} className="space-y-12">
            {/* Show ResultsDashboard if we have a completed post */}
            {completedPost ? (
              <ResultsDashboard post={completedPost} onReset={handleReset} />
            ) : (
              <>
                {/* ── Hero ── */}
                <motion.section
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="text-center"
                >
                  <motion.div
                    variants={fadeUp}
                    className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent-bright"
                  >
                    <Zap className="h-3 w-3" />
                    AI-Powered Craft Marketing
                  </motion.div>

                  <motion.h1
                    variants={fadeUp}
                    className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl"
                  >
                    Turn your crafts into{" "}
                    <span className="gradient-text">scroll-stopping</span> posts
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    className="mx-auto mt-4 max-w-xl text-lg text-white/50"
                  >
                    Upload a photo of your handmade creation. Our AI removes the
                    background, generates a breathtaking scene, and writes
                    compelling marketing copy — all in seconds.
                  </motion.p>
                </motion.section>

                {/* ── Upload + Processing ── */}
                <motion.section
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="grid gap-6 lg:grid-cols-5"
                >
                  {/* Upload zone */}
                  <motion.div variants={fadeUp} className="lg:col-span-3">
                    <div className="relative">
                      <DropZone onFileAccepted={handleFileAccepted} />
                      {/* Glassmorphic scanning‐laser overlay */}
                      <ProcessingOverlay />
                    </div>

                    {/* Process button */}
                    <AnimatePresence>
                      {uploadedFile && !isProcessing && (
                        <motion.button
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          onClick={handleProcess}
                          className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-accent-dim to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-accent/40 hover:brightness-110"
                        >
                          <Sparkles className="h-4 w-4" />
                          Boost with AI
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Side panel */}
                  <motion.div
                    variants={fadeUp}
                    className="lg:col-span-2 space-y-4"
                  >
                    <AnimatePresence mode="wait">
                      {isProcessing ? (
                        <ProcessingCard currentStep={currentStep} />
                      ) : (
                        <motion.div
                          key="info"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="glass rounded-2xl p-6 space-y-3"
                        >
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-bright/80">
                            What happens next
                          </h3>
                          <ul className="space-y-2 text-sm text-white/50">
                            <li className="flex items-start gap-2">
                              <ImageIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent/60" />
                              Background removed with AI precision
                            </li>
                            <li className="flex items-start gap-2">
                              <Palette className="mt-0.5 h-4 w-4 shrink-0 text-accent/60" />
                              Lifestyle scene generated around your product
                            </li>
                            <li className="flex items-start gap-2">
                              <Type className="mt-0.5 h-4 w-4 shrink-0 text-accent/60" />
                              SEO-ready copy &amp; hashtags created
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Stats card */}
                    <div className="glass rounded-2xl p-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-bright/80">
                        Platform Stats
                      </h3>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        {[
                          { label: "Posts Created", value: "12.4K" },
                          { label: "Avg. CTR Lift", value: "+340%" },
                          { label: "Time Saved", value: "6.2 hrs" },
                          { label: "Happy Makers", value: "2.1K" },
                        ].map((stat) => (
                          <div key={stat.label}>
                            <p className="text-xl font-bold text-foreground">
                              {stat.value}
                            </p>
                            <p className="text-xs text-white/40">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.section>

                {/* ── Features Grid ── */}
                <motion.section
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <motion.div
                        key={f.title}
                        variants={fadeUp}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="glass rounded-2xl p-5 transition-colors hover:border-accent/20"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                          <Icon className="h-5 w-5 text-accent" />
                        </div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {f.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-white/40">
                          {f.desc}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.section>
              </>
            )}
          </motion.div>
        )}

        {/* ────── GALLERY SECTION ────── */}
        {activeSection === "gallery" && (
          <motion.div key="gallery" {...pageTransition}>
            <ErrorBoundary fallbackMessage="Failed to load the gallery.">
              <GallerySection />
            </ErrorBoundary>
          </motion.div>
        )}

        {/* ────── SETTINGS SECTION ────── */}
        {activeSection === "settings" && (
          <motion.div key="settings" {...pageTransition}>
            <SettingsSection />
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
