"use client";

import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Download,
  Hash,
  Sparkles,
  ImageIcon,
  RotateCcw,
} from "lucide-react";
import { useState, useCallback } from "react";
import type { SerializedPost } from "@/actions/productActions";
import { useAppStore } from "@/store/useAppStore";

interface ResultsDashboardProps {
  post: SerializedPost;
  onReset: () => void;
}

/**
 * Once the mutation is successful, hides the upload zone and displays:
 * - The final AI-generated lifestyle image
 * - 3 generated captions in styled cards, each with a Copy button
 * - Hashtag chips
 * - Toast notifications via Zustand
 */
export default function ResultsDashboard({ post, onReset }: Readonly<ResultsDashboardProps>) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const addToast = useAppStore((s) => s.addToast);

  const copyToClipboard = useCallback(
    (text: string, field: string) => {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      addToast({ type: "success", message: "Copied to clipboard!" });
      setTimeout(() => setCopiedField(null), 2000);
    },
    [addToast]
  );

  const hashtagString = (post.hashtags ?? [])
    .map((h: string) => `#${h}`)
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
            <Sparkles className="h-4 w-4 text-success" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {post.productTitle ?? "Your Boosted Post"}
            </h2>
            <p className="text-xs text-white/40">
              AI-enhanced and ready to publish
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-white/8 px-3 py-1.5 text-xs font-medium text-white/50 transition hover:border-white/15 hover:text-white/80"
        >
          <RotateCcw className="h-3 w-3" />
          Create Another
        </button>
      </div>

      {/* ── Image + Captions Grid ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: AI-generated lifestyle image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-3 ring-1 ring-accent/20 animate-pulse-glow"
        >
          <div className="mb-2 flex items-center justify-between text-xs text-white/40">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-accent-bright">AI-Generated Scene</span>
            </div>
            {post.processedImage && (
              <a
                href={post.processedImage}
                download={`craftboost-${post.id}.png`}
                className="flex items-center gap-1 rounded px-2 py-0.5 text-accent transition hover:bg-accent/10"
              >
                <Download className="h-3 w-3" />
                Save
              </a>
            )}
          </div>
          <div className="overflow-hidden rounded-xl">
            <img
              src={post.processedImage ?? post.originalImage}
              alt="AI Enhanced"
              className="h-72 w-full object-contain"
            />
          </div>

          {/* Original thumbnail */}
          <div className="mt-3 flex items-center gap-3">
            <div className="overflow-hidden rounded-lg border border-white/6">
              <img
                src={post.originalImage}
                alt="Original"
                className="h-14 w-14 object-cover"
              />
            </div>
            <div className="text-xs text-white/30">
              <div className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                Original upload
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: 3 Caption Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-bright/80">
            Marketing Captions
          </h3>

          {(post.captions ?? []).map((caption: string, idx: number) => (
            <motion.div
              key={caption.slice(0, 40)}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + idx * 0.1 }}
              className="glass group rounded-xl p-4 transition-colors hover:border-accent/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="mb-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent-bright">
                    Caption {idx + 1}
                  </span>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                    {caption}
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(caption, `caption-${idx}`)
                  }
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/6 hover:text-white/70"
                  title="Copy caption"
                >
                  {copiedField === `caption-${idx}` ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Hashtags ── */}
      {post.hashtags && post.hashtags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-bright/80">
              Hashtags
            </h3>
            <button
              onClick={() => copyToClipboard(hashtagString, "hashtags")}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-white/40 transition hover:bg-white/6 hover:text-white/70"
            >
              {copiedField === "hashtags" ? (
                <>
                  <Check className="h-3 w-3 text-success" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy All
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-bright transition hover:bg-accent/20"
              >
                <Hash className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
