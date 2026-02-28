"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Upload,
  Wand2,
  Type,
  Star,
  ChevronRight,
  TreePine,
  Menu,
  X,
} from "lucide-react";

/* Inline SVGs for social icons (lucide deprecated brand icons) */
function TwitterIcon({ className, style }: Readonly<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
    </svg>
  );
}

function InstagramIcon({ className, style }: Readonly<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function GithubIcon({ className, style }: Readonly<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
import UserMenu from "@/components/auth/UserMenu";

/* ══════════════════════════════════════════════════════════
   Design tokens (earthy deep-green landing palette)
   ══════════════════════════════════════════════════════════ */
const GREEN = {
  bg: "#0b1f0e",
  bgLight: "#132916",
  card: "rgba(17,38,20,0.55)",
  cardBorder: "rgba(74,222,128,0.12)",
  accent: "#4ade80",
  accentDim: "#22c55e",
  gold: "#fbbf24",
  white: "#f5f5f5",
  muted: "rgba(245,245,245,0.5)",
};

/* ══════════════════════════════════════════════════════════
   Shared animation variants
   ══════════════════════════════════════════════════════════ */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ══════════════════════════════════════════════════════════
   Before / After Slider
   ══════════════════════════════════════════════════════════ */
function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback(
    (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setSplit((x / rect.width) * 100);
    },
    [],
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => handleMove(e.clientX);
    const onUp = () => setIsDragging(false);
    globalThis.addEventListener("pointermove", onMove);
    globalThis.addEventListener("pointerup", onUp);
    return () => {
      globalThis.removeEventListener("pointermove", onMove);
      globalThis.removeEventListener("pointerup", onUp);
    };
  }, [isDragging, handleMove]);

  return (
    <motion.div
      ref={containerRef}
      variants={scaleIn}
      className="relative mx-auto aspect-16/10 w-full max-w-3xl select-none overflow-hidden rounded-2xl border"
      style={{ borderColor: GREEN.cardBorder }}
    >
      {/* ── "After" layer (full width underneath) ── */}
      <div className="absolute inset-0">
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background:
              "linear-gradient(145deg, #fef9c3 0%, #fde68a 30%, #fed7aa 70%, #fef3c7 100%)",
          }}
        >
          {/* Sunny playroom scene (illustrated) */}
          <div className="relative flex flex-col items-center gap-3">
            <div className="flex gap-4 opacity-20">
              {["a", "b", "c", "d", "e"].map((id, i) => (
                <div
                  key={id}
                  className="h-6 w-14 rounded-full bg-white"
                  style={{ opacity: 0.4 + i * 0.1 }}
                />
              ))}
            </div>
            {/* Toy block illustration */}
            <div className="relative">
              <div className="h-28 w-28 rounded-2xl bg-amber-600 shadow-2xl sm:h-36 sm:w-36" />
              <div className="absolute -right-4 -top-4 h-12 w-12 rounded-xl bg-red-400 shadow-lg" />
              <div className="absolute -bottom-3 -left-5 h-10 w-16 rounded-xl bg-emerald-500 shadow-lg" />
            </div>
            <p className="mt-2 rounded-full bg-black/10 px-4 py-1 text-sm font-bold text-amber-900">
              ✨ AI-Generated Playroom Scene
            </p>
          </div>
        </div>
      </div>

      {/* ── "Before" layer (clipped) ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${split}%` }}
      >
        <div
          className="flex h-full items-center justify-center"
          style={{
            width: containerRef.current?.offsetWidth ?? "100%",
            background:
              "linear-gradient(145deg, #3b3024 0%, #4a3c2e 40%, #594a3a 70%, #6b5a48 100%)",
          }}
        >
          {/* Raw workbench scene */}
          <div className="relative flex flex-col items-center gap-3">
            <div className="flex gap-2 opacity-15">
              {["🔨", "🪚", "📐", "🪵", "🔧"].map((e) => (
                <span key={e} className="text-xl">
                  {e}
                </span>
              ))}
            </div>
            <div className="relative">
              <div className="h-28 w-28 rounded-2xl border-2 border-dashed border-amber-700/50 bg-amber-800/60 sm:h-36 sm:w-36" />
              <div className="absolute -right-3 -top-2 h-8 w-8 rounded bg-amber-700/40" />
              <div className="absolute -bottom-2 -left-3 h-6 w-12 rounded bg-amber-700/30" />
            </div>
            <p className="mt-2 rounded-full bg-white/10 px-4 py-1 text-sm font-bold text-amber-200/80">
              📷 Raw Workbench Photo
            </p>
          </div>
        </div>
      </div>

      {/* ── Drag handle ── */}
      <div
        className="absolute top-0 z-20 flex h-full cursor-col-resize touch-none items-center"
        style={{ left: `${split}%`, transform: "translateX(-50%)" }}
        onPointerDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
      >
        <div className="h-full w-0.5 bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
        <div
          className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/60 shadow-xl backdrop-blur-sm"
        >
          <ChevronRight className="h-4 w-4 -translate-x-0.5 text-white" />
          <ChevronRight className="h-4 w-4 -translate-x-2.5 rotate-180 text-white" />
        </div>
      </div>

      {/* Labels */}
      <span className="absolute left-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
        Before
      </span>
      <span className="absolute right-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
        After
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Testimonials Data
   ══════════════════════════════════════════════════════════ */
const testimonials = [
  {
    name: "Priya Sharma",
    role: "Founder, Little Timber Co.",
    text: "CraftBoost saved me 6+ hours a week on product photos. The AI scenes look like I hired a professional photographer!",
    stars: 5,
  },
  {
    name: "Marcus Johansson",
    role: "Etsy Seller, WoodWonder",
    text: "My click-through rate jumped 340% after switching to CraftBoost-generated listings. Absolute game changer.",
    stars: 5,
  },
  {
    name: "Aisha Patel",
    role: "Artisan, BambooBloom Toys",
    text: "The AI captions are incredibly on-brand. I just upload, review, and post. My social media has never looked better.",
    stars: 5,
  },
  {
    name: "Tom Greenfield",
    role: "Owner, Tiny Oak Workshop",
    text: "I was skeptical about AI for craft photography, but the quality blew me away. My Etsy sales doubled in a month.",
    stars: 5,
  },
  {
    name: "Lena Kowalski",
    role: "Seller, Handmade Haven",
    text: "Background removal alone is worth the price. But the lifestyle scenes? That's what makes it truly magical.",
    stars: 4,
  },
  {
    name: "James Chen",
    role: "Craftsman, Maple & Pine",
    text: "CraftBoost turned my workshop snapshots into scroll-stopping social content. My followers grew 5x in 2 months.",
    stars: 5,
  },
];

/* ══════════════════════════════════════════════════════════
   How It Works Features
   ══════════════════════════════════════════════════════════ */
const steps = [
  {
    icon: Upload,
    title: "Snap & Upload",
    desc: "Take a raw photo of your handmade toy, right from the workbench. No studio setup needed — just your phone and your craft.",
    step: "01",
  },
  {
    icon: Wand2,
    title: "AI Scene Generation",
    desc: "Our AI removes the background, then Stability AI generates a breathtaking lifestyle scene — a sunlit playroom or nursery.",
    step: "02",
  },
  {
    icon: Type,
    title: "Auto-Captions & SEO",
    desc: "Google Gemini writes 3 unique, SEO-optimized marketing captions and trending hashtags tailored to your craft niche.",
    step: "03",
  },
];

/* ══════════════════════════════════════════════════════════
   Landing Page Component
   ══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{ background: GREEN.bg, color: GREEN.white }}
    >
      {/* ════════ NAVBAR ════════ */}
      <nav
        className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl"
        style={{
          background: "rgba(11,31,14,0.75)",
          borderColor: GREEN.cardBorder,
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${GREEN.accent}15` }}
            >
              <TreePine className="h-5 w-5" style={{ color: GREEN.accent }} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Craft<span style={{ color: GREEN.accent }}>Boost</span>{" "}AI
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {["Features", "How It Works", "Testimonials"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replaceAll(/\s+/g, "-")}`}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: GREEN.muted }}
              >
                {label}
              </a>
            ))}
            <UserMenu />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t px-6 pb-6 pt-4 md:hidden"
            style={{
              background: "rgba(11,31,14,0.95)",
              borderColor: GREEN.cardBorder,
            }}
          >
            <div className="flex flex-col gap-4">
              {["Features", "How It Works", "Testimonials"].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replaceAll(/\s+/g, "-")}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium"
                  style={{ color: GREEN.muted }}
                >
                  {label}
                </a>
              ))}
              <div className="mt-2">
                <UserMenu />
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ════════ HERO ════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24"
      >
        {/* Background glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{
            width: 600,
            height: 400,
            background: `radial-gradient(circle, ${GREEN.accent}18 0%, transparent 70%)`,
          }}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
            style={{
              borderColor: `${GREEN.accent}30`,
              background: `${GREEN.accent}08`,
              color: GREEN.accent,
            }}
          >
            <Sparkles className="h-3 w-3" />
            AI-Powered Craft Marketing Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Turn Your Workbench
            <br />
            into a{" "}
            <span className="landing-gradient-text">Professional Studio</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl"
            style={{ color: GREEN.muted }}
          >
            Upload a raw photo of your handcrafted toy. Our AI removes the
            background, generates a stunning lifestyle scene, and writes
            scroll-stopping marketing copy — all in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-black shadow-xl transition-all hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${GREEN.accent} 0%, ${GREEN.accentDim} 100%)`,
                boxShadow: `0 8px 32px ${GREEN.accent}30`,
              }}
            >
              <Sparkles className="h-5 w-5" />
              Start Boosting — It&apos;s Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 rounded-2xl border px-8 py-4 text-base font-semibold transition-colors hover:bg-white/5"
              style={{ borderColor: `${GREEN.accent}30`, color: GREEN.muted }}
            >
              See How It Works
            </a>
          </motion.div>
        </motion.div>

        {/* Before / After Slider */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 mt-16 w-full max-w-4xl px-4"
        >
          <BeforeAfterSlider />
          <p
            className="mt-4 text-center text-sm font-medium"
            style={{ color: GREEN.muted }}
          >
            ↔ Drag the handle to compare raw photo vs. AI-generated scene
          </p>
        </motion.div>

        {/* Decorative bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: `linear-gradient(to top, ${GREEN.bg}, transparent)`,
          }}
        />
      </motion.section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section id="how-it-works" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-16 text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-sm font-bold uppercase tracking-widest"
              style={{ color: GREEN.accent }}
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
            >
              Three Steps to{" "}
              <span className="landing-gradient-text">Stunning Content</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-base"
              style={{ color: GREEN.muted }}
            >
              From workbench snapshot to scroll-stopping social post in under 30
              seconds.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-8 md:grid-cols-3"
          >
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  variants={fadeUp}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.25 },
                  }}
                  className="group relative overflow-hidden rounded-3xl border p-8 backdrop-blur-xl transition-all"
                  style={{
                    background: GREEN.card,
                    borderColor: GREEN.cardBorder,
                  }}
                >
                  {/* Step number watermark */}
                  <span
                    className="pointer-events-none absolute -right-3 -top-5 text-8xl font-black select-none"
                    style={{ color: `${GREEN.accent}08` }}
                  >
                    {s.step}
                  </span>

                  <div
                    className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ background: `${GREEN.accent}12` }}
                  >
                    <Icon
                      className="h-7 w-7"
                      style={{ color: GREEN.accent }}
                    />
                  </div>

                  <h3 className="relative z-10 mb-2 text-xl font-bold">
                    {s.title}
                  </h3>
                  <p
                    className="relative z-10 text-sm leading-relaxed"
                    style={{ color: GREEN.muted }}
                  >
                    {s.desc}
                  </p>

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 50% 100%, ${GREEN.accent}10 0%, transparent 60%)`,
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ════════ FEATURES HIGHLIGHT ════════ */}
      <section id="features" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid items-center gap-16 lg:grid-cols-2"
          >
            {/* Left: text */}
            <motion.div variants={fadeUp}>
              <p
                className="mb-3 text-sm font-bold uppercase tracking-widest"
                style={{ color: GREEN.accent }}
              >
                Why CraftBoost?
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Built for Makers
                <br />
                Who Mean Business
              </h2>
              <p
                className="mt-4 max-w-md text-base leading-relaxed"
                style={{ color: GREEN.muted }}
              >
                CraftBoost AI understands the artisan aesthetic. Every scene,
                caption, and hashtag is tailored for handmade bamboo and wooden
                toy makers.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "AI background removal with pixel-perfect edges",
                  "Lifestyle scene generation powered by Stability AI",
                  "3 unique SEO-optimized captions per photo",
                  "Trending hashtag suggestions for your niche",
                  "Gallery to manage and track all your posts",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `${GREEN.accent}20` }}
                    >
                      <Sparkles
                        className="h-3 w-3"
                        style={{ color: GREEN.accent }}
                      />
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: GREEN.muted }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: floating stat cards */}
            <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-md">
              <div
                className="absolute inset-0 rounded-3xl blur-[80px]"
                style={{ background: `${GREEN.accent}08` }}
              />
              <div className="relative grid grid-cols-2 gap-4">
                {[
                  { value: "12.4K", label: "Posts Created", delay: 0 },
                  { value: "+340%", label: "Avg. CTR Lift", delay: 0.6 },
                  { value: "6.2 hrs", label: "Saved per Week", delay: 1.2 },
                  { value: "2.1K", label: "Happy Makers", delay: 1.8 },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="animate-float rounded-2xl border p-6 text-center backdrop-blur-xl"
                    style={{
                      background: GREEN.card,
                      borderColor: GREEN.cardBorder,
                      animationDelay: `${stat.delay}s`,
                    }}
                  >
                    <p className="text-3xl font-extrabold">{stat.value}</p>
                    <p
                      className="mt-1 text-xs font-medium"
                      style={{ color: GREEN.muted }}
                    >
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section id="testimonials" className="relative overflow-hidden py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-14 text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-sm font-bold uppercase tracking-widest"
              style={{ color: GREEN.accent }}
            >
              Loved by Makers
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              What Artisans Are Saying
            </motion.h2>
          </motion.div>
        </div>

        {/* Scrolling marquee */}
        <div className="relative">
          {/* Fade edges */}
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24"
            style={{
              background: `linear-gradient(to right, ${GREEN.bg}, transparent)`,
            }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24"
            style={{
              background: `linear-gradient(to left, ${GREEN.bg}, transparent)`,
            }}
          />

          <div className="animate-marquee flex w-max gap-6">
            {/* Duplicate for seamless loop */}
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className="w-85 shrink-0 rounded-2xl border p-6 backdrop-blur-xl"
                style={{
                  background: GREEN.card,
                  borderColor: GREEN.cardBorder,
                }}
              >
                {/* Stars */}
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star
                      key={`${t.name}-star-${si}`}
                      className="h-4 w-4 fill-current"
                      style={{ color: GREEN.gold }}
                    />
                  ))}
                </div>
                <p
                  className="mb-4 text-sm leading-relaxed"
                  style={{ color: GREEN.muted }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs" style={{ color: GREEN.muted }}>
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            style={{
              width: 500,
              height: 300,
              background: `radial-gradient(circle, ${GREEN.accent}15 0%, transparent 70%)`,
            }}
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="relative z-10"
          >
            <motion.div
              variants={fadeUp}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl"
              style={{ background: `${GREEN.accent}15` }}
            >
              <Sparkles
                className="h-8 w-8"
                style={{ color: GREEN.accent }}
              />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
            >
              Ready to{" "}
              <span className="landing-gradient-text">Boost Your Craft</span>?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-lg"
              style={{ color: GREEN.muted }}
            >
              Join 2,100+ artisan makers already creating scroll-stopping
              content with AI. No credit card required.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-3 rounded-2xl px-10 py-5 text-lg font-bold text-black shadow-2xl transition-all hover:brightness-110"
                style={{
                  background: `linear-gradient(135deg, ${GREEN.accent} 0%, ${GREEN.accentDim} 100%)`,
                  boxShadow: `0 8px 40px ${GREEN.accent}35`,
                }}
              >
                <Sparkles className="h-5 w-5" />
                Launch CraftBoost AI
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-sm"
              style={{ color: `${GREEN.muted}80` }}
            >
              Free to start · No credit card · Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer
        className="border-t px-6 py-16"
        style={{
          background: GREEN.bgLight,
          borderColor: GREEN.cardBorder,
        }}
      >
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `${GREEN.accent}15` }}
              >
                <TreePine
                  className="h-5 w-5"
                  style={{ color: GREEN.accent }}
                />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Craft<span style={{ color: GREEN.accent }}>Boost</span>{" "}AI
              </span>
            </Link>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: GREEN.muted }}
            >
              AI-powered marketing for artisan makers. Turn raw craft photos
              into professional, scroll-stopping content.
            </p>
            <div className="mt-4 flex gap-3">
              {[
                { Icon: TwitterIcon, label: "Twitter" },
                { Icon: InstagramIcon, label: "Instagram" },
                { Icon: GithubIcon, label: "GitHub" },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:bg-white/5"
                  style={{ borderColor: GREEN.cardBorder }}
                >
                  <Icon className="h-4 w-4" style={{ color: GREEN.muted }} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Changelog", "Roadmap"],
            },
            {
              title: "Resources",
              links: ["Documentation", "API Reference", "Blog", "Tutorials"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "Privacy Policy", "Terms of Service"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-widest">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color: GREEN.muted }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row"
          style={{ borderColor: GREEN.cardBorder }}
        >
          <p className="text-xs" style={{ color: GREEN.muted }}>
            © {new Date().getFullYear()} CraftBoost AI. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: `${GREEN.muted}60` }}>
            Handcrafted with ❤️ for makers who build with their hands.
          </p>
        </div>
      </footer>
    </div>
  );
}
