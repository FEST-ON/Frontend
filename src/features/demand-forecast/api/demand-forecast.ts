import { festivalApi } from "@/shared/lib/api";
import type { Tone } from "@/shared/ui/status-pill";

/** 절대 방문객 수가 아니라 이 축제 자신의 일평균 대비 배수 구간이다. */
export type DemandLabel = "LOW" | "NORMAL" | "HIGH" | "PEAK";

export const DEMAND_LABEL: Record<DemandLabel, string> = {
  LOW: "한산",
  NORMAL: "보통",
  HIGH: "혼잡",
  PEAK: "최대",
};

export const DEMAND_RATIO: Record<DemandLabel, string> = {
  LOW: "일평균 0.85배 미만",
  NORMAL: "일평균 0.85~1.10배",
  HIGH: "일평균 1.10~1.30배",
  PEAK: "일평균 1.30배 초과",
};

export const DEMAND_TONE: Record<DemandLabel, Tone> = {
  LOW: "neutral",
  NORMAL: "success",
  HIGH: "busy",
  PEAK: "danger",
};

export const REGION_OPTIONS = [
  { value: "CAPITAL", label: "수도권" },
  { value: "METRO", label: "광역시" },
  { value: "OTHER", label: "그 외" },
] as const;

export type Region = (typeof REGION_OPTIONS)[number]["value"];

export interface DemandForecastDay {
  date: string;
  dayNumber: number;
  /** 표에 없는 조합이면 label이 null로 오고 fallback에 이유가 담긴다. */
  label: DemandLabel | null;
  confidence: number | null;
  fallback: string | null;
  tableVersion?: string;
  builtAt?: string;
  holdoutAccuracy?: number;
  source?: string;
}

export interface DemandForecast {
  festivalId: string;
  days: DemandForecastDay[];
  peakDays: string[];
}

export interface DemandForecastInput {
  dailyAverage: number;
  region: Region;
  holidayDates: string[];
  startDate?: string;
  festivalDays?: number;
}

/** 개막 전 사전 배치용 조회. 서버는 구워 둔 조회표를 한 번 읽을 뿐이라 저장되는 값은 없다. */
export function fetchDemandForecast({ dailyAverage, region, holidayDates, startDate, festivalDays }: DemandForecastInput) {
  const query = new URLSearchParams({
    daily_average: String(dailyAverage),
    region,
  });
  if (startDate && festivalDays) {
    query.set("start_date", startDate);
    query.set("festival_days", String(festivalDays));
  }
  holidayDates.forEach((date) => query.append("holiday_dates", date));
  return festivalApi<DemandForecast>(`/demand-forecast?${query}`, { cache: "no-store" });
}
