"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRecentPosts } from "@/actions/productActions";
import type { SerializedPost } from "@/actions/productActions";
import { queryKeys } from "./queryKeys";

interface UsePostsOptions {
  page?: number;
  limit?: number;
  status?: SerializedPost["status"];
}

/**
 * Fetches a paginated, optionally filtered list of posts.
 * Cached for 5 min (via QueryProvider defaults) to avoid
 * redundant DB hits when switching tabs.
 */
export function usePosts(opts: UsePostsOptions = {}) {
  const { page = 1, limit = 12, status } = opts;
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.posts.list(page, status),
    queryFn: () => getRecentPosts(page, limit, status),

    // Pre-seed individual post caches from the list response
    select(data) {
      for (const post of data.posts) {
        queryClient.setQueryData(queryKeys.posts.detail(post.id), post);
      }
      return data;
    },

    placeholderData: (prev) => prev, // keep previous page visible while next loads
  });
}
