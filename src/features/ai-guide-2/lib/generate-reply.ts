import { getCongestionZones, getFacilities, getScheduleItems, getTransportOptions } from "@/entities/festival";
import type { ChatMessage } from "@/entities/visitor";
import type { Dictionary, Locale } from "@/shared/lib/i18n";
import { BCP47_BY_LOCALE } from "@/shared/lib/i18n";

interface ReplyResult {
  content: string;
  sources: string[];
}

const CONGESTION_KEYWORDS = /(혼잡|대기|사람|crowd|busy|wait|拥挤|排队|人多|混雑|待ち|込)/i;
const TRANSPORT_KEYWORDS = /(주차|셔틀|버스|교통|shuttle|bus|parking|transport|地铁|公交|接驳|停车|交通|シャトル|バス|駐車|交通)/i;
const FACILITY_KEYWORDS = /(화장실|수유실|구급|편의시설|restroom|toilet|facility|nursing|洗手间|设施|哺乳|お手洗い|施設|授乳)/i;
const SCHEDULE_KEYWORDS = /(일정|공연|프로그램|오늘|schedule|program|today|日程|节目|今日|プログラム|本日)/i;

export async function generatePersoReply(question: string, t: Dictionary, locale: Locale): Promise<ReplyResult> {
  const query = question.toLowerCase();

  if (CONGESTION_KEYWORDS.test(query)) {
    const busiest = [...(await getCongestionZones(locale))].sort((a, b) => b.waitMinutes - a.waitMinutes)[0];
    return {
      content: t.aiGuide.replies.congestion(busiest.zone, busiest.waitMinutes),
      sources: [t.aiGuide.replies.congestionSource],
    };
  }

  if (TRANSPORT_KEYWORDS.test(query)) {
    const transportOptions = await getTransportOptions(locale);
    return {
      content: transportOptions
        .map((item) => t.aiGuide.replies.transportLine(t.festivalData.transportMode[item.mode], item.label, t.festivalData.transportStatus[item.status]))
        .join("\n"),
      sources: [t.aiGuide.replies.transportSource],
    };
  }

  if (FACILITY_KEYWORDS.test(query)) {
    const facilities = await getFacilities(locale);
    return {
      content: facilities
        .slice(0, 3)
        .map((item) => t.aiGuide.replies.facilityLine(item.name, item.location, item.walkMinutes))
        .join("\n"),
      sources: [t.aiGuide.replies.facilitySource],
    };
  }

  if (SCHEDULE_KEYWORDS.test(query)) {
    const scheduleItems = await getScheduleItems(locale);
    return {
      content: scheduleItems
        .slice(0, 3)
        .map((item) => t.aiGuide.replies.scheduleLine(item.time, item.title, item.stage))
        .join("\n"),
      sources: [t.aiGuide.replies.scheduleSource],
    };
  }

  return {
    content: t.aiGuide.replies.fallback,
    sources: [],
  };
}

export function buildPersoMessage(
  role: ChatMessage["role"],
  content: string,
  locale: Locale,
  sources?: string[],
): ChatMessage {
  return {
    id: `perso-${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    timestamp: new Date().toLocaleTimeString(BCP47_BY_LOCALE[locale], { hour: "2-digit", minute: "2-digit" }),
    sources,
  };
}
