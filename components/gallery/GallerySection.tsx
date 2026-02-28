"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePosts, useDeletePost } from "@/hooks";
import { useAppStore } from "@/store/useAppStore";
import {
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";

const statusBadge: Record<
  string,
  { icon: typeof Clock; label: string; color: string }
> = {
  pending: { icon: Clock, label: "Pending", color: "text-warning bg-warning/10" },
  processing: { icon: Loader2, label: "Processing", color: "text-accent-bright bg-accent/10" },
  completed: { icon: CheckCircle2, label: "Completed", color: "text-success bg-success/10" },
  failed: { icon: AlertCircle, label: "Failed", color: "text-danger bg-danger/10" },
};

export default function GallerySection() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePosts({ page });
  const deleteMutation = useDeletePost();
  const addToast = useAppStore((s) => s.addToast);

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => addToast({ type: "success", message: "Post deleted" }),
      onError: () => addToast({ type: "error", message: "Failed to delete post" }),
    });
  };

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Your Gallery</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["a", "b", "c", "d", "e", "f"].map((id) => (
            <div
              key={id}
              className="glass animate-shimmer rounded-2xl bg-linear-to-r from-surface via-surface-elevated to-surface p-4"
            >
              <div className="h-40 rounded-xl bg-white/3" />
              <div className="mt-3 h-4 w-2/3 rounded bg-white/6" />
              <div className="mt-2 h-3 w-1/2 rounded bg-white/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (isError) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-danger/60" />
        <p className="mt-3 text-sm text-white/50">
          Failed to load gallery. Make sure your database is connected.
        </p>
      </div>
    );
  }

  const posts = data?.posts ?? [];

  /* ── Empty state ── */
  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Your Gallery</h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass flex flex-col items-center justify-center rounded-2xl p-12 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
            <LayoutGrid className="h-8 w-8 text-accent/40" />
          </div>
          <h3 className="mt-4 text-base font-medium text-foreground">
            No posts yet
          </h3>
          <p className="mt-1 max-w-xs text-sm text-white/40">
            Upload your first craft photo to see AI-enhanced results here.
          </p>
        </motion.div>
      </div>
    );
  }

  /* ── Gallery grid ── */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Gallery</h2>
        <span className="text-xs text-white/30">{data?.total ?? 0} posts</span>
      </div>

      <motion.div
        layout
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {posts.map((post) => {
            const badge = statusBadge[post.status] ?? statusBadge.pending;
            const BadgeIcon = badge.icon;
            return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className="glass group relative overflow-hidden rounded-2xl p-3 transition-colors hover:border-accent/20"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl bg-black/20">
                  <img
                    src={
                      post.processedImage ??
                      post.originalImage
                    }
                    alt={post.productTitle ?? "Craft"}
                    className="h-44 w-full object-contain"
                  />
                  {/* Status badge */}
                  <div
                    className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.color}`}
                  >
                    <BadgeIcon
                      className={`h-3 w-3 ${
                        post.status === "processing" ? "animate-spin" : ""
                      }`}
                    />
                    {badge.label}
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white/0 transition group-hover:text-white/70 hover:bg-danger/80! hover:text-white!"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Info */}
                <div className="mt-3 px-1">
                  <h4 className="truncate text-sm font-medium text-foreground">
                    {post.productTitle ?? "Untitled Craft"}
                  </h4>
                  {post.captions && post.captions.length > 0 && (
                    <p className="mt-1 line-clamp-2 text-xs text-white/40">
                      {post.captions[0]}
                    </p>
                  )}
                  <p className="mt-2 text-[10px] text-white/20">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* ── Pagination ── */}
      {(data?.totalPages ?? 1) > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-white/8 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/15 hover:text-white/80 disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-xs text-white/30">
            {page} / {data?.totalPages}
          </span>
          <button
            disabled={page >= (data?.totalPages ?? 1)}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-white/8 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/15 hover:text-white/80 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
