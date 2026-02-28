"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveProductPost, updateProductPost } from "@/actions/productActions";
import type { SerializedPost } from "@/actions/productActions";
import { queryKeys } from "./queryKeys";
import { useAppStore } from "@/store/useAppStore";

/**
 * Converts a File to a base64 data-URI (runs client-side).
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * The primary mutation hook driving the full AI workflow:
 *
 * 1. Convert file → base64, create a pending post (saveProductPost)
 * 2. Mark as processing, call /api/process
 * 3. The API orchestrates: Photoroom → Gemini (3 captions) → Stability AI
 * 4. Returns the fully completed SerializedPost
 *
 * Updates the Zustand processingPhase at each stage so the
 * ProcessingOverlay can show real-time status text.
 */
export function useProcessProduct() {
  const queryClient = useQueryClient();
  const setProcessingPhase = useAppStore((s) => s.setProcessingPhase);

  return useMutation({
    mutationFn: async (file: File): Promise<SerializedPost> => {
      // Phase 1: uploading
      setProcessingPhase("uploading");
      const base64 = await fileToBase64(file);

      // Create initial record
      const post = await saveProductPost({
        originalImage: base64,
        status: "pending",
      });

      // Mark processing
      await updateProductPost(post.id, { status: "processing" });

      // Phase 2-4: hand off to the AI pipeline endpoint
      // (the overlay ticks through removing_bg → writing_copy → generating_scene
      //  via timers — the real phases happen server-side in sequence)
      setProcessingPhase("removing_bg");

      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(
          errBody.error ?? `AI processing failed (${response.status})`
        );
      }

      const result: SerializedPost = await response.json();
      setProcessingPhase("done");
      return result;
    },

    /* ── Optimistic update ── */
    onMutate: async () => {
      // Cancel in-flight list queries so optimistic data isn't overwritten
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.all });

      const previousPosts = queryClient.getQueryData(
        queryKeys.posts.list(1)
      );

      return { previousPosts };
    },

    onSuccess: (data) => {
      // Seed the detail cache with the completed post
      queryClient.setQueryData(queryKeys.posts.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },

    onError: (_err, _vars, context) => {
      // Rollback optimistic update
      if (context?.previousPosts) {
        queryClient.setQueryData(
          queryKeys.posts.list(1),
          context.previousPosts
        );
      }
    },

    onSettled: () => {
      setProcessingPhase("idle");
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}
