import { delay } from "@/shared/lib/async";

export interface OpsSnapshot {
  reservationsToday: number;
  entryToday: number;
  avgWaitMinutes: number;
  couponsIssued: number;
  couponsUsed: number;
  activeVisitorsEstimate: number;
  hourlyEntries: { hour: string; count: number }[];
}

export const opsSnapshot: OpsSnapshot = {
  reservationsToday: 1240,
  entryToday: 3820,
  avgWaitMinutes: 9,
  couponsIssued: 512,
  couponsUsed: 287,
  activeVisitorsEstimate: 4200,
  hourlyEntries: [
    { hour: "11시", count: 180 },
    { hour: "12시", count: 340 },
    { hour: "13시", count: 420 },
    { hour: "14시", count: 560 },
    { hour: "15시", count: 610 },
    { hour: "16시", count: 480 },
    { hour: "17시", count: 690 },
    { hour: "18시", count: 540 },
  ],
};

export async function fetchOpsSnapshot() {
  return delay(opsSnapshot, 500);
}
