"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccessibilityLanguage } from "@/entities/visitor";

interface AccessibilityState {
  language: AccessibilityLanguage;
  largeText: boolean;
  voiceGuide: boolean;
  setLanguage: (language: AccessibilityLanguage) => void;
  toggleLargeText: () => void;
  toggleVoiceGuide: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      language: "한국어",
      largeText: false,
      voiceGuide: false,
      setLanguage: (language) => set({ language }),
      toggleLargeText: () => set((s) => ({ largeText: !s.largeText })),
      toggleVoiceGuide: () => set((s) => ({ voiceGuide: !s.voiceGuide })),
    }),
    { name: "festai-accessibility" },
  ),
);
