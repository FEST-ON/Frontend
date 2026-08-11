export const FESTIVAL_ID = "EST34-2026";

export const MAP_LOCATION_CATEGORIES = [
  { value: "booth", label: "판매 부스" },
  { value: "program", label: "프로그램" },
  { value: "food", label: "푸드존" },
  { value: "facility", label: "편의시설" },
  { value: "parking", label: "주차장" },
] as const;

export type MapLocationCategory = (typeof MAP_LOCATION_CATEGORIES)[number]["value"];

export interface MapLocation {
  id: number;
  name: string;
  category: MapLocationCategory;
  latitude: number;
  longitude: number;
  description?: string | null;
  is_visible: boolean;
}

export type MapLocationInput = Omit<MapLocation, "id">;

export const DEFAULT_MAP_LOCATIONS: MapLocation[] = [
  {
    id: 1,
    name: "메인스테이지",
    category: "program",
    latitude: 37.5266,
    longitude: 126.9338,
    description: "개막 공연과 주요 무대 프로그램이 열리는 공간입니다.",
    is_visible: true,
  },
  {
    id: 2,
    name: "업사이클링 체험 부스",
    category: "booth",
    latitude: 37.527,
    longitude: 126.9328,
    description: "폐현수막 공방과 친환경 체험 프로그램을 운영합니다.",
    is_visible: true,
  },
  {
    id: 3,
    name: "로컬푸드존",
    category: "food",
    latitude: 37.5261,
    longitude: 126.9347,
    description: "지역 상점의 메뉴와 다회용기 참여 부스를 만날 수 있습니다.",
    is_visible: true,
  },
  {
    id: 4,
    name: "통합 안내소",
    category: "facility",
    latitude: 37.5264,
    longitude: 126.9332,
    description: "분실물, 접근성 지원과 프로그램 안내를 제공합니다.",
    is_visible: true,
  },
  {
    id: 5,
    name: "축제 구급부스",
    category: "facility",
    latitude: 37.5269,
    longitude: 126.9335,
    description: "응급 처치와 안전 지원을 받을 수 있습니다.",
    is_visible: true,
  },
];

type ApiEnvelope<T> = { data: T };
const STORAGE_KEY = "festai-map-locations";

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
}

function canUseDemoStorage() {
  return process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_MAP_DEMO_STORAGE !== "false";
}

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
    typeof row.longitude === "number"
  );
}

function readDemoLocations(): MapLocation[] {
  if (typeof window === "undefined") return DEFAULT_MAP_LOCATIONS;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_MAP_LOCATIONS;
  try {
    const rows = JSON.parse(stored) as unknown[];
    return Array.isArray(rows) ? rows.filter(isMapLocation) : DEFAULT_MAP_LOCATIONS;
  } catch {
    return DEFAULT_MAP_LOCATIONS;
  }
}

function writeDemoLocations(rows: MapLocation[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  return rows;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("DEMO_STORAGE");
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) throw new Error(`Map location API failed: ${response.status}`);
  return unwrap<T>((await response.json()) as T | ApiEnvelope<T>);
}

export async function fetchMapLocations(options: { includeHidden?: boolean } = {}): Promise<MapLocation[]> {
  const scope = options.includeHidden ? "admin" : "public";
  try {
    const rows = await request<MapLocation[]>(`/${scope}/festivals/${FESTIVAL_ID}/map-locations`);
    const validRows = Array.isArray(rows) ? rows.filter(isMapLocation) : [];
    return options.includeHidden ? validRows : validRows.filter((row) => row.is_visible !== false);
  } catch (error) {
    if (apiBaseUrl()) console.info("Map location API is unavailable. Using local demo storage.", error);
    const rows = readDemoLocations();
    return options.includeHidden ? rows : rows.filter((row) => row.is_visible !== false);
  }
}

export async function createMapLocation(input: MapLocationInput): Promise<MapLocation> {
  try {
    return await request<MapLocation>(`/admin/festivals/${FESTIVAL_ID}/map-locations`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (error) {
    if (!canUseDemoStorage()) throw error;
    if (apiBaseUrl()) console.info("Create API is unavailable. Saving to local demo storage.", error);
    const rows = readDemoLocations();
    const created = { ...input, id: Math.max(0, ...rows.map((row) => row.id)) + 1 };
    writeDemoLocations([...rows, created]);
    return created;
  }
}

export async function updateMapLocation(id: number, input: MapLocationInput): Promise<MapLocation> {
  try {
    return await request<MapLocation>(`/admin/festivals/${FESTIVAL_ID}/map-locations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  } catch (error) {
    if (!canUseDemoStorage()) throw error;
    if (apiBaseUrl()) console.info("Update API is unavailable. Saving to local demo storage.", error);
    const rows = readDemoLocations();
    const updated = { ...input, id };
    writeDemoLocations(rows.map((row) => (row.id === id ? updated : row)));
    return updated;
  }
}

export async function deleteMapLocation(id: number): Promise<void> {
  try {
    await request<unknown>(`/admin/festivals/${FESTIVAL_ID}/map-locations/${id}`, { method: "DELETE" });
  } catch (error) {
    if (!canUseDemoStorage()) throw error;
    if (apiBaseUrl()) console.info("Delete API is unavailable. Updating local demo storage.", error);
    writeDemoLocations(readDemoLocations().filter((row) => row.id !== id));
  }
}
