export interface MapLocation {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  congestion_level: "free" | "normal" | "crowded" | string;
}

export const DEFAULT_MAP_LOCATIONS: MapLocation[] = [
  {
    id: 1,
    name: "메인스테이지",
    category: "program",
    latitude: 37.5266,
    longitude: 126.9338,
    description: "개막 공연과 주요 무대 프로그램이 열리는 공간입니다.",
    congestion_level: "crowded",
  },
  {
    id: 2,
    name: "체험존 A",
    category: "program",
    latitude: 37.527,
    longitude: 126.9328,
    description: "업사이클링 공방과 가족 체험 프로그램을 운영합니다.",
    congestion_level: "normal",
  },
  {
    id: 3,
    name: "로컬푸드존",
    category: "food",
    latitude: 37.5261,
    longitude: 126.9347,
    description: "지역 상점 메뉴와 다회용기 참여 부스가 모여 있습니다.",
    congestion_level: "normal",
  },
  {
    id: 4,
    name: "통합 안내소",
    category: "facility",
    latitude: 37.5264,
    longitude: 126.9332,
    description: "분실물, 접근성 지원, 프로그램 안내를 제공합니다.",
    congestion_level: "free",
  },
  {
    id: 5,
    name: "축제 응급부스",
    category: "facility",
    latitude: 37.5269,
    longitude: 126.9335,
    description: "응급 처치와 안전 지원을 받을 수 있습니다.",
    congestion_level: "free",
  },
  {
    id: 6,
    name: "여의도 임시주차장 A",
    category: "parking",
    latitude: 37.5256,
    longitude: 126.9324,
    description: "사전예약 차량이 이용하는 임시주차장입니다.",
    congestion_level: "crowded",
  },
];

type ApiEnvelope<T> = { data: T };

function unwrap<T>(payload: T | ApiEnvelope<T>): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}

function isMapLocation(value: unknown): value is MapLocation {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<MapLocation>;
  return (
    typeof row.id === "number" &&
    typeof row.name === "string" &&
    typeof row.category === "string" &&
    typeof row.latitude === "number" &&
    typeof row.longitude === "number" &&
    typeof row.congestion_level === "string"
  );
}

export async function fetchMapLocations(): Promise<MapLocation[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return DEFAULT_MAP_LOCATIONS;

  try {
    const response = await fetch(`${baseUrl}/public/festivals/EST34-2026/map`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Map API failed: ${response.status}`);

    const rows = unwrap<MapLocation[]>((await response.json()) as MapLocation[] | ApiEnvelope<MapLocation[]>);
    const validRows = Array.isArray(rows) ? rows.filter(isMapLocation) : [];
    return validRows.length > 0 ? validRows : DEFAULT_MAP_LOCATIONS;
  } catch (error) {
    console.info("Map API is unavailable. Using bundled festival coordinates.", error);
    return DEFAULT_MAP_LOCATIONS;
  }
}

