"use client";

import { create } from "zustand";
import type { Ticket, TicketStatus } from "@/entities/ticket";
import { tickets as seedTickets } from "@/entities/ticket";

interface TicketBoardState {
  tickets: Ticket[];
  hydrated: boolean;
  hydrate: (tickets: Ticket[]) => void;
  updateStatus: (id: string, status: TicketStatus) => void;
}

export const useTicketBoardStore = create<TicketBoardState>((set) => ({
  tickets: seedTickets,
  hydrated: false,
  hydrate: (tickets) => set((s) => (s.hydrated ? s : { tickets, hydrated: true })),
  updateStatus: (id, status) =>
    set((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? { ...t, status } : t)) })),
}));
