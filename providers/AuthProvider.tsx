"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * Wraps the app tree with next-auth's SessionProvider so
 * `useSession()` works in any client component.
 */
export default function AuthProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SessionProvider>{children}</SessionProvider>;
}
