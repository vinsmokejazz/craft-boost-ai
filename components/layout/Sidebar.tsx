"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  LayoutGrid,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const navItems = [
  { key: "upload" as const, label: "Create", icon: Upload },
  { key: "gallery" as const, label: "Gallery", icon: LayoutGrid },
  { key: "settings" as const, label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, activeSection, setActiveSection } =
    useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 72 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col glass-strong"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/20">
          <Sparkles className="h-5 w-5 text-accent-bright" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="gradient-text text-lg font-bold tracking-tight whitespace-nowrap"
            >
              CraftBoost AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-white/6" />

      {/* Nav items */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-2">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = activeSection === key;
          return (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent-bright"
                  : "text-white/50 hover:bg-white/4 hover:text-white/80"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-accent/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-5 w-5 shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12 }}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/6 hover:text-white/60"
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
    </motion.aside>
  );
}
