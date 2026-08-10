"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/entities/visitor";

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  reset: () => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "안녕하세요! FESTAI AI 축제 안내예요 😊 승인된 축제 데이터를 바탕으로 일정, 교통, 시설, 안전정보를 안내하고, 취향에 맞는 코스도 추천해드려요. 무엇이 궁금하신가요?",
  timestamp: "지금",
  sources: ["2026 그린한강 페스티벌 공식 운영정보"],
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [WELCOME_MESSAGE],
  isTyping: false,
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  setTyping: (typing) => set({ isTyping: typing }),
  reset: () => set({ messages: [WELCOME_MESSAGE] }),
}));
