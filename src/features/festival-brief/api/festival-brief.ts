import { FESTIVAL_ID } from "@/features/map/api/map-locations";

export interface FestivalBrief {
  summary: string;
  metric_label: string;
  metric_value: string;
  status: "normal" | "warning" | "critical";
  sources: string[];
  generated_at: string;
}

const DEMO_BRIEF: FestivalBrief = {
  summary: "다회용기 사용률이 목표 60%보다 22%p 낮습니다. 푸드존 주문대 안내와 반납소 위치 홍보를 우선 강화해주세요.",
  metric_label: "다회용기 사용률",
  metric_value: "38%",
  status: "warning",
  sources: ["다회용기 주문 1,140건", "전체 음식 주문 3,000건", "운영 목표 60%"],
  generated_at: "2026-08-11T16:30:00+09:00",
};

export async function fetchFestivalBrief(): Promise<FestivalBrief> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return DEMO_BRIEF;
  try {
    const response = await fetch(`${baseUrl}/admin/festivals/${FESTIVAL_ID}/ai-brief?focus=esg`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Festival brief API failed: ${response.status}`);
    const payload = (await response.json()) as FestivalBrief | { data: FestivalBrief };
    return "data" in payload ? payload.data : payload;
  } catch (error) {
    console.info("Festival brief API is unavailable. Using demo brief.", error);
    return DEMO_BRIEF;
  }
}
