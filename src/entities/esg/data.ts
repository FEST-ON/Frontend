import { delay } from "@/shared/lib/async";
import type { EsgMetric, EsgReportSection } from "./model";

export const esgMetrics: EsgMetric[] = [
  {
    id: "e1",
    pillar: "환경",
    name: "모바일 리플릿 이용률",
    value: 87,
    unit: "%",
    target: 90,
    source: "QR 모바일웹 접속 로그",
    approved: true,
    approvedAt: "2026-09-20",
    trend: [61, 68, 74, 79, 83, 87],
  },
  {
    id: "e2",
    pillar: "환경",
    name: "다회용기 사용률",
    value: 72,
    unit: "%",
    target: 80,
    source: "푸드존 POS 연동 데이터",
    approved: true,
    approvedAt: "2026-09-20",
    trend: [40, 48, 55, 62, 68, 72],
  },
  {
    id: "e3",
    pillar: "환경",
    name: "분리배출 정확도",
    value: 91,
    unit: "%",
    target: 85,
    source: "그린서포터즈 현장 집계",
    approved: true,
    approvedAt: "2026-09-20",
    trend: [70, 75, 80, 85, 88, 91],
  },
  {
    id: "e4",
    pillar: "환경",
    name: "대중교통 이용률",
    value: 64,
    unit: "%",
    target: 70,
    source: "셔틀·지하철 연계 설문",
    approved: false,
    approvedAt: null,
    trend: [50, 54, 58, 60, 62, 64],
  },
  {
    id: "s1",
    pillar: "사회",
    name: "지역업체 참여 수",
    value: 38,
    unit: "개",
    target: 40,
    source: "참여업체 등록대장",
    approved: true,
    approvedAt: "2026-09-15",
    trend: [20, 25, 29, 33, 36, 38],
  },
  {
    id: "s2",
    pillar: "사회",
    name: "접근성 서비스 이용",
    value: 412,
    unit: "건",
    target: 500,
    source: "다국어·음성·큰글씨 모드 이용 로그",
    approved: true,
    approvedAt: "2026-09-20",
    trend: [120, 190, 260, 320, 370, 412],
  },
  {
    id: "s3",
    pillar: "사회",
    name: "민원 평균 응답시간",
    value: 27,
    unit: "분",
    target: 30,
    source: "운영 티켓 시스템",
    approved: true,
    approvedAt: "2026-09-20",
    trend: [45, 40, 35, 31, 29, 27],
  },
  {
    id: "s4",
    pillar: "사회",
    name: "안전사고 대응시간",
    value: 6,
    unit: "분",
    target: 10,
    source: "안전관리 요원 현장 로그",
    approved: true,
    approvedAt: "2026-09-20",
    trend: [12, 11, 9, 8, 7, 6],
  },
  {
    id: "g1",
    pillar: "거버넌스",
    name: "지표 데이터 승인율",
    value: 83,
    unit: "%",
    target: 100,
    source: "ESG 데이터 승인 이력",
    approved: false,
    approvedAt: null,
    trend: [55, 62, 68, 74, 79, 83],
  },
  {
    id: "g2",
    pillar: "거버넌스",
    name: "정보공개 항목 수",
    value: 14,
    unit: "개",
    target: 16,
    source: "공공데이터 개방 대장",
    approved: true,
    approvedAt: "2026-09-10",
    trend: [8, 9, 10, 12, 13, 14],
  },
];

export const esgReportSections: EsgReportSection[] = [
  {
    pillar: "환경",
    summary:
      "다회용기·분리배출·모바일 리플릿 확대로 1회용품 사용량이 전년 대비 감소 추세이며, 대중교통 이용률은 목표치 근접 중입니다.",
    highlights: [
      "다회용기 사용률 72% (전년 대비 +21%p)",
      "종이 리플릿 대신 모바일 이용률 87% 달성",
      "분리배출 정확도 91%로 그린서포터즈 현장 교육 효과 확인",
    ],
  },
  {
    pillar: "사회",
    summary:
      "지역 소상공인 참여와 접근성 서비스 이용이 꾸준히 증가했으며, 민원·안전 대응 속도가 목표 기준 내로 관리되고 있습니다.",
    highlights: [
      "지역업체 38곳 참여로 지역경제 순환 기여",
      "다국어·음성·큰글씨 접근성 서비스 412건 이용",
      "안전사고 평균 대응시간 6분으로 목표(10분) 대비 우수",
    ],
  },
  {
    pillar: "거버넌스",
    summary:
      "지표별 데이터 출처와 승인 이력 관리 체계를 구축했으며, 일부 지표는 담당자 승인 절차가 진행 중입니다.",
    highlights: [
      "정보공개 항목 14개 확대 운영",
      "데이터 승인율 83%, 잔여 지표 승인 절차 진행 중",
      "AI 기반 민원 분류로 반복 이슈 조기 파악 체계 마련",
    ],
  },
];

export async function fetchEsgMetrics() {
  return delay(esgMetrics, 500);
}
export async function fetchEsgReport() {
  return delay(esgReportSections, 600);
}
