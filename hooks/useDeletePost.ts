"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductPost } from "@/actions/productActions";
import type { SerializedPost } from "@/actions/productActions";
import { queryKeys } from "./queryKeys";

/**
 * Deletes a post with optimistic removal from the list cache.
 * The gallery grid instantly removes the card; on error it reappears.
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductPost(id),

    /* ── Optimistic removal ── */
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.all });

      // Snapshot every list page in cache
      const snapshotKeys = queryClient
        .getQueryCache()
        .findAll({ queryKey: queryKeys.posts.all });

      const snapshots: { key: readonly unknown[]; data: unknown }[] = [];

      for (const entry of snapshotKeys) {
        snapshots.push({
          key: entry.queryKey,
          data: queryClient.getQueryData(entry.queryKey),
        });

        // Optimistically remove the post from each cached page
        queryClient.setQueryData(
          entry.queryKey,
          (
            old:
              | { posts: SerializedPost[]; total: number; page: number; totalPages: number }
              | undefined
          ) => {
            if (!old) return old;
            return {
              ...old,
              posts: old.posts.filter((p) => p.id !== id),
              total: old.total - 1,
            };
          }
        );
      }

      // Also remove from detail cache
      queryClient.removeQueries({
        queryKey: queryKeys.posts.detail(id),
      });

      return { snapshots };
    },

    onError: (_err, _id, context) => {
      // Rollback all list caches
      if (context?.snapshots) {
        for (const snap of context.snapshots) {
          queryClient.setQueryData(snap.key, snap.data);
        }
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}
