import { create } from "zustand";

/* ── Processing phase enum ── */
export type ProcessingPhase =
  | "idle"
  | "uploading"
  | "removing_bg"
  | "generating_scene"
  | "writing_copy"
  | "done";

/* ── Toast types ── */
export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

/* ── Store shape ── */
interface AppState {
  /* File selection */
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;

  /* Processing pipeline */
  processingPhase: ProcessingPhase;
  setProcessingPhase: (phase: ProcessingPhase) => void;

  /* Sidebar */
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  /* Navigation */
  activeSection: "upload" | "gallery" | "settings";
  setActiveSection: (s: AppState["activeSection"]) => void;

  /* Active post tracking */
  activePostId: string | null;
  setActivePostId: (id: string | null) => void;

  /* Toasts */
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

let toastCounter = 0;

/** Schedules auto-dismiss of a toast after 4 seconds (extracted to reduce nesting). */
function scheduleDismiss(
  set: (fn: (s: AppState) => Partial<AppState>) => void,
  id: string,
) {
  setTimeout(() => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  }, 4000);
}

export const useAppStore = create<AppState>((set) => ({
  /* File selection */
  selectedFile: null,
  setSelectedFile: (selectedFile) => set({ selectedFile }),

  /* Processing pipeline */
  processingPhase: "idle",
  setProcessingPhase: (processingPhase) => set({ processingPhase }),

  /* Sidebar */
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  /* Navigation */
  activeSection: "upload",
  setActiveSection: (activeSection) => set({ activeSection }),

  /* Active post */
  activePostId: null,
  setActivePostId: (activePostId) => set({ activePostId }),

  /* Toasts */
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastCounter}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    scheduleDismiss(set, id);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
