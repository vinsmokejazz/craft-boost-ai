"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ── Palette (same green tokens as landing page) ── */
const GREEN = {
  bg: "#0b1f0e",
  accent: "#4ade80",
  accentDim: "#22c55e",
  cardBorder: "rgba(74,222,128,0.12)",
  white: "#f5f5f5",
  muted: "rgba(245,245,245,0.5)",
};

/**
 * Renders inside the landing-page Navbar:
 * - Logged out → "Get Started" link (to /login)
 * - Logged in  → Google avatar + dropdown with name / email / Sign Out
 */
export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      globalThis.addEventListener("mousedown", handleClickOutside);
      return () =>
        globalThis.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  /* Loading skeleton */
  if (status === "loading") {
    return (
      <div className="h-9 w-24 animate-pulse rounded-xl bg-white/10" />
    );
  }

  /* ── Logged OUT ── */
  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-black shadow-lg transition-all hover:brightness-110"
        style={{
          background: `linear-gradient(135deg, ${GREEN.accent} 0%, ${GREEN.accentDim} 100%)`,
          boxShadow: `0 4px 20px ${GREEN.accent}40`,
        }}
      >
        Get Started
      </Link>
    );
  }

  /* ── Logged IN ── */
  const user = session.user;

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-full border p-1 pr-3 transition-colors hover:bg-white/5"
        style={{ borderColor: GREEN.cardBorder }}
        aria-label="User menu"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: `${GREEN.accent}25` }}
          >
            <User className="h-4 w-4" style={{ color: GREEN.accent }} />
          </div>
        )}
        <span
          className="hidden text-sm font-medium sm:block"
          style={{ color: GREEN.white }}
        >
          {user.name?.split(" ")[0]}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border backdrop-blur-xl"
            style={{
              background: "rgba(11,31,14,0.92)",
              borderColor: GREEN.cardBorder,
              boxShadow: `0 8px 40px rgba(0,0,0,0.4)`,
            }}
          >
            {/* User info */}
            <div className="border-b px-4 py-3" style={{ borderColor: GREEN.cardBorder }}>
              <p
                className="text-sm font-bold"
                style={{ color: GREEN.white }}
              >
                {user.name}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: GREEN.muted }}>
                {user.email}
              </p>
            </div>

            {/* Dashboard link */}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: GREEN.white }}
            >
              <User className="h-4 w-4" style={{ color: GREEN.muted }} />
              Dashboard
            </Link>

            {/* Sign out */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 border-t px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
              style={{
                color: "#f87171",
                borderColor: GREEN.cardBorder,
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
