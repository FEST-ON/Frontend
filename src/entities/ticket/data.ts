import { delay } from "@/shared/lib/async";
import type { Ticket } from "./model";

export const tickets: Ticket[] = [
  {
    id: "tk-2026091801",
    type: "민원",
    title: "그늘막 부족으로 대기 불편",
    description: "메인스테이지 대기열에 그늘막이 부족하다는 민원이 반복 접수되고 있습니다.",
    assignee: "김민준",
    status: "처리중",
    priority: "높음",
    category: "편의시설",
    createdAt: "09-18 13:24",
    aiTag: "반복이슈 · 그늘막/휴게공간",
  },
  {
    id: "tk-2026091802",
    type: "사고",
    title: "체험존 A 경미한 낙상 사고",
    description: "업사이클링 부스 근처 바닥 미끄러짐으로 경미한 낙상 발생, 구급실 이송 완료.",
    assignee: "오세훈",
    status: "완료",
    priority: "높음",
    category: "안전",
    createdAt: "09-19 14:47",
  },
  {
    id: "tk-2026091803",
    type: "공지",
    title: "우천 시 드론라이트쇼 일정 변경 안내",
    description: "9/19 저녁 강수 확률 60% 예보, 대체 프로그램(실내 공연) 준비 필요.",
    assignee: "이서연",
    status: "접수",
    priority: "중간",
    category: "일정",
    createdAt: "09-19 09:10",
  },
  {
    id: "tk-2026091804",
    type: "민원",
    title: "다회용기 반납 위치 안내 부족",
    description: "다회용기 반납 스테이션 위치를 찾기 어렵다는 후기가 다수 접수.",
    assignee: "장서윤",
    status: "접수",
    priority: "중간",
    category: "ESG운영",
    createdAt: "09-19 16:02",
    aiTag: "반복이슈 · 안내 사인 부족",
  },
  {
    id: "tk-2026091805",
    type: "민원",
    title: "주차장 잔여면 실시간 정보 오류",
    description: "앱 상 잔여 주차면과 실제 현장 정보가 다르다는 민원.",
    assignee: "박도현",
    status: "처리중",
    priority: "낮음",
    category: "교통",
    createdAt: "09-20 10:33",
  },
  {
    id: "tk-2026091806",
    type: "공지",
    title: "폐막식 시상식 순서 변경 안내",
    description: "친환경 시민 시상 순서를 폐막공연 이전으로 조정합니다.",
    assignee: "윤아름",
    status: "완료",
    priority: "낮음",
    category: "일정",
    createdAt: "09-20 11:15",
  },
];

export async function fetchTickets() {
  return delay(tickets, 500);
}
