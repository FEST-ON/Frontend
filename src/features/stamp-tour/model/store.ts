"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StampTourState {
  collectedIds: string[];
  collect: (id: string) => void;
  reset: () => void;
}

export const useStampTourStore = create<StampTourState>()(
  persist(
    (set) => ({
      collectedIds: ["st1", "st2"],
      collect: (id) =>
        set((s) => (s.collectedIds.includes(id) ? s : { collectedIds: [...s.collectedIds, id] })),
      reset: () => set({ collectedIds: [] }),
    }),
    { name: "festai-stamp-tour" },
  ),
);
