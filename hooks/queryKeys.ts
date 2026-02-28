/**
 * Centralised TanStack Query key factory.
 * Every hook imports keys from here so cache invalidation
 * is consistent and typo-free.
 */
export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    list: (page: number, status?: string) =>
      ["posts", "list", { page, status }] as const,
    detail: (id: string) => ["posts", "detail", id] as const,
  },
} as const;
