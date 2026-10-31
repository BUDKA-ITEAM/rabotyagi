"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
type UI = {
  theme: "system" | "light" | "dark";
  resolvedTheme: "light" | "dark";
  setResolvedTheme: (theme: "light" | "dark") => void;
  setTheme: (theme: UI["theme"]) => void;
  chatPeer: string | null;
  setChatPeer: (id: string | null) => void;
};
export const useUI = create<UI>()(
  persist(
    (set) => ({
      theme: "system",
      resolvedTheme: "light",
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
      setTheme: (theme) => set({ theme }),
      chatPeer: null,
      setChatPeer: (chatPeer) => set({ chatPeer }),
    }),
    { name: "rabotyagi-ui", partialize: (state) => ({ theme: state.theme }) },
  ),
);
