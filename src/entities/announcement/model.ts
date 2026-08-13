export type AnnouncementSeverity = "INFO" | "WARNING" | "EMERGENCY";
export type AnnouncementStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface Announcement {
  id: string;
  title: string;
  severity: AnnouncementSeverity;
  audience: string[];
  targetAreaIds: string[];
  startsAt: string;
  endsAt: string | null;
  status: AnnouncementStatus;
  version: number;
}

export const SEVERITY_OPTIONS: { value: AnnouncementSeverity; label: string }[] = [
  { value: "INFO", label: "일반" },
  { value: "WARNING", label: "주의" },
  { value: "EMERGENCY", label: "긴급" },
];

export const AUDIENCE_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "VISITOR", label: "방문객" },
  { value: "MERCHANT", label: "입점업체" },
  { value: "STAFF", label: "운영진" },
];
