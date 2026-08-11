"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/entities/visitor";

interface PersoChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  reset: () => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "perso-welcome",
  role: "assistant",
  content: "안녕하세요! Perso AI 축제 가이드예요. 일정, 교통, 편의시설과 안전 정보를 편하게 물어보세요.",
  timestamp: "지금",
  sources: ["축제 운영 승인 정보"],
};

export const usePersoChatStore = create<PersoChatState>((set) => ({
  messages: [WELCOME_MESSAGE],
  isTyping: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (isTyping) => set({ isTyping }),
  reset: () => set({ messages: [WELCOME_MESSAGE], isTyping: false }),
}));
