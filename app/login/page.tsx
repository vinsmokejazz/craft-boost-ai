"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { TreePine } from "lucide-react";
import Link from "next/link";

/* ── Design tokens (matching landing page green palette) ── */
const GREEN = {
  bg: "#0b1f0e",
  accent: "#4ade80",
  accentDim: "#22c55e",
  cardBorder: "rgba(74,222,128,0.12)",
  white: "#f5f5f5",
  muted: "rgba(245,245,245,0.5)",
};

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{ background: GREEN.bg }}
    >
      {/* ── Background glow ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        style={{
          width: 500,
          height: 350,
          background: `radial-gradient(circle, ${GREEN.accent}12 0%, transparent 70%)`,
        }}
      />

      {/* ── Login card ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: `${GREEN.accent}15` }}
            >
              <TreePine className="h-6 w-6" style={{ color: GREEN.accent }} />
            </div>
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: GREEN.white }}
            >
              Craft<span style={{ color: GREEN.accent }}>Boost</span>{" "}AI
            </span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border p-8 backdrop-blur-xl sm:p-10"
          style={{
            background: "rgba(17,38,20,0.55)",
            borderColor: GREEN.cardBorder,
            boxShadow: `0 0 80px ${GREEN.accent}08`,
          }}
        >
          <h1
            className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: GREEN.white }}
          >
            Welcome back
          </h1>
          <p
            className="mt-2 text-center text-sm"
            style={{ color: GREEN.muted }}
          >
            Sign in to start transforming your craft photos into
            scroll-stopping content.
          </p>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div
              className="h-px flex-1"
              style={{ background: GREEN.cardBorder }}
            />
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: GREEN.muted }}
            >
              continue with
            </span>
            <div
              className="h-px flex-1"
              style={{ background: GREEN.cardBorder }}
            />
          </div>

          {/* Google button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-base font-bold shadow-lg transition-shadow hover:shadow-xl"
            style={{
              background: "#ffffff",
              color: GREEN.bg,
            }}
          >
            {/* Google "G" logo (inline SVG) */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </motion.button>

          {/* Terms note */}
          <p
            className="mt-6 text-center text-xs leading-relaxed"
            style={{ color: `${GREEN.muted}80` }}
          >
            By signing in you agree to our{" "}
            <span className="underline underline-offset-2">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline underline-offset-2">
              Privacy Policy
            </span>{"."}
          </p>
        </motion.div>

        {/* Back to home */}
        <motion.p
          variants={fadeUp}
          className="mt-8 text-center text-sm"
          style={{ color: GREEN.muted }}
        >
          <Link
            href="/"
            className="underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            ← Back to home
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
