"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductPost } from "@/actions/productActions";
import { queryKeys } from "./queryKeys";

/**
 * Fetches a single post by ID.
 * Enabled only when `id` is truthy (avoids fire-on-mount for "no post yet").
 */
export function usePost(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id ?? ""),
    queryFn: () => getProductPost(id!),
    enabled: !!id,
  });
}
