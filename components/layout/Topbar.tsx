"use client";

import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const sectionTitles: Record<string, string> = {
  upload: "Create Post",
  gallery: "Gallery",
  settings: "Settings",
};

export default function Topbar() {
  const { activeSection, sidebarOpen } = useAppStore();

  return (
    <motion.header
      initial={false}
      animate={{ paddingLeft: sidebarOpen ? 240 : 72 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between px-6 glass"
    >
      {/* Section title */}
      <motion.h1
        key={activeSection}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold tracking-tight text-foreground"
      >
        {sectionTitles[activeSection] ?? "CraftBoost AI"}
      </motion.h1>

      {/* Right‑side actions */}
      <div className="flex items-center gap-2">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/6 hover:text-white/70">
          <Search className="h-4 w-4" />
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/6 hover:text-white/70">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
        </button>
        {/* Avatar placeholder */}
        <div className="ml-2 h-8 w-8 rounded-full bg-linear-to-br from-accent to-indigo-500" />
      </div>
    </motion.header>
  );
}
