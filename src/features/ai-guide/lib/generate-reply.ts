import {
  facilities,
  scheduleItems,
  transportOptions,
} from "@/entities/festival";
import type { ChatMessage } from "@/entities/visitor";

interface ReplyResult {
  content: string;
  sources: string[];
}

/**
 * 데모용 규칙 기반 응답 생성기.
 * 실제 서비스에서는 Perso AI(자연어 응답) + 앨런(Alan) 연동으로 대체될 부분입니다.
 */
export function generateReply(question: string): ReplyResult {
  const q = question.toLowerCase();

  if (/(주차|차량|자차)/.test(q)) {
    const parking = transportOptions.find((t) => t.mode === "주차");
    return {
      content: `${parking?.label}에 ${parking?.detail}. 현재 상태는 "${parking?.status}"이며 대중교통이나 무료 셔틀도 이용할 수 있어요.`,
      sources: ["운영 승인 교통정보"],
    };
  }
  if (/(지하철|버스|셔틀|교통|가는\s?법|오는\s?법)/.test(q)) {
    const lines = transportOptions.map((t) => `- ${t.mode}: ${t.label} (${t.status})`).join("\n");
    return { content: `축제장 이동 방법을 안내드려요.\n${lines}`, sources: ["운영 승인 교통정보"] };
  }
  if (/(화장실|구급실|안내소|수유실|보관소|편의시설)/.test(q)) {
    const list = facilities.slice(0, 3).map((f) => `- ${f.name} (도보 ${f.walkMinutes}분, ${f.location})`).join("\n");
    return { content: `가까운 편의시설을 안내드려요.\n${list}`, sources: ["시설 승인 데이터"] };
  }
  if (/(안전|사고|응급|비상)/.test(q)) {
    return {
      content: "안전 관련 문의시군요. 축제 전 구역에 안전관리 요원이 상시 배치되어 있고, 구급실은 안내소 옆 텐트에 있어요. 위급 상황엔 현장 요원에게 바로 말씀해 주세요.",
      sources: ["안전관리 운영계획"],
    };
  }
  if (/(일정|프로그램|공연|몇시)/.test(q)) {
    const list = scheduleItems.slice(0, 3).map((s) => `- ${s.day} ${s.time} ${s.title} (${s.stage})`).join("\n");
    return { content: `주요 일정을 안내드려요.\n${list}`, sources: ["승인된 축제 프로그램 일정"] };
  }
  if (/(코스|추천|뭐\s?하지|뭐하지|일행|같이)/.test(q)) {
    return {
      content: "동행유형과 관심사, 체류시간을 알려주시면 맞춤 코스를 짜드릴게요! 상단의 \"맞춤 코스 추천\" 탭을 눌러보세요 🙂",
      sources: [],
    };
  }
  if (/(다회용기|반납|분리배출|친환경|제로웨이스트|쓰레기)/.test(q)) {
    return {
      content:
        "다회용기는 그린마켓(G-1)과 체험존 A 앞 회수 스테이션에서 반납하실 수 있어요. 반납 시 스탬프투어 스탬프도 함께 적립돼요 ♻️",
      sources: ["ESG 운영 가이드"],
    };
  }
  return {
    content:
      "질문 감사해요! 아래 자주 묻는 질문 중에서 골라 눌러보시면 바로 답변드려요.",
    sources: [],
  };
}

export function buildMessage(role: ChatMessage["role"], content: string, sources?: string[]): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    sources,
  };
}
