"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ToastContainer from "@/components/ui/ToastContainer";

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />

      {/* Main content area — shifts based on sidebar width */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 240 : 72 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen pt-16"
      >
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </motion.main>

      {/* Global toast notifications */}
      <ToastContainer />
    </div>
  );
}
