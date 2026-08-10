import { delay } from "@/shared/lib/async";
import type { LocalCoupon, StampSpot } from "./model";

export const stampSpots: StampSpot[] = [
  { id: "st1", name: "통합 안내소", location: "정문 입구", collected: true },
  { id: "st2", name: "업사이클링 공방", location: "체험존 A-2", collected: true },
  { id: "st3", name: "그린마켓", location: "마켓존 G-1", collected: false },
  { id: "st4", name: "지속가능 사진전", location: "전시홀", collected: false },
  { id: "st5", name: "물빛광장 포토존", location: "물빛광장", collected: false },
];

export const localCoupons: LocalCoupon[] = [
  { id: "cp1", store: "로컬빵집 밀도", category: "베이커리", discount: "다회용기 이용 시 10% 할인", location: "여의도 본점 (축제장 도보 6분)", expiresAt: "2026-09-27", used: false },
  { id: "cp2", store: "여의도 수제버거", category: "음식점", discount: "스탬프 3개 이상 2,000원 할인", location: "여의나루역 인근", expiresAt: "2026-09-30", used: false },
  { id: "cp3", store: "제로웨이스트 마켓 다시봄", category: "리빙", discount: "친환경 제품 15% 할인", location: "그린마켓 G-1", expiresAt: "2026-09-20", used: true },
];

export async function fetchStampSpots() {
  return delay(stampSpots, 400);
}
export async function fetchLocalCoupons() {
  return delay(localCoupons, 450);
}
