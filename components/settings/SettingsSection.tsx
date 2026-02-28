"use client";

import { motion } from "framer-motion";
import { Settings, KeyRound, Database, Cpu } from "lucide-react";

const configItems = [
  {
    icon: KeyRound,
    label: "API Keys",
    desc: "Manage your Gemini, Photoroom, and Stability AI credentials.",
    status: "Configured via .env.local",
  },
  {
    icon: Database,
    label: "Database",
    desc: "MongoDB Atlas connection and data management.",
    status: "Server-side only",
  },
  {
    icon: Cpu,
    label: "AI Models",
    desc: "Choose generation quality, scene styles, and caption tone.",
    status: "Coming soon",
  },
];

export default function SettingsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <Settings className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <p className="text-xs text-white/40">
            Configuration and preferences
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {configItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ x: 2 }}
              className="glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-accent/15"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/4">
                <Icon className="h-5 w-5 text-white/40" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">
                  {item.label}
                </h4>
                <p className="mt-0.5 text-xs text-white/40">{item.desc}</p>
              </div>
              <span className="rounded-full bg-white/4 px-3 py-1 text-[10px] font-medium text-white/30">
                {item.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
