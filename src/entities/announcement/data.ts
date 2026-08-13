import { adminApi, adminFestivalId } from "@/shared/lib/api";
import type { Announcement, AnnouncementSeverity, AnnouncementStatus } from "./model";

interface AnnouncementRow {
  id: string;
  title: string;
  severity?: AnnouncementSeverity;
  audience?: string[];
  target_area_ids?: string[];
  starts_at?: string;
  ends_at?: string | null;
  status?: AnnouncementStatus;
  version: number;
  versions?: Array<{ id: string }>;
}

function normalize(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    severity: row.severity ?? "INFO",
    audience: row.audience ?? [],
    targetAreaIds: row.target_area_ids ?? [],
    startsAt: row.starts_at ?? "",
    endsAt: row.ends_at ?? null,
    status: row.status ?? "DRAFT",
    version: row.version,
  };
}

export async function fetchAnnouncements() {
  const festivalId = await adminFestivalId();
  const ids = await adminApi<Array<{ id: string }>>(`/admin/festivals/${festivalId}/announcements`);
  const rows = await Promise.all(
    ids.map((row) => adminApi<AnnouncementRow>(`/admin/festivals/${festivalId}/announcements/${row.id}`)),
  );
  return rows.map(normalize).sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}

export async function fetchAreaOptions() {
  const festivalId = await adminFestivalId();
  const rows = await adminApi<Array<{ id: string; name: string }>>(`/admin/festivals/${festivalId}/areas`);
  return rows.map((row) => ({ id: row.id, name: row.name }));
}

async function step<T>(label: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`[${label}] ${message}`);
  }
}

export interface PublishAnnouncementInput {
  title: string;
  severity: AnnouncementSeverity;
  audience: string[];
  targetAreaIds: string[];
  startsAt: string;
  endsAt?: string;
}

export async function publishAnnouncement(input: PublishAnnouncementInput) {
  const festivalId = await adminFestivalId();
  const announcement = await step("1. 공지 생성", () =>
    adminApi<{ id: string }>(`/admin/festivals/${festivalId}/announcements`, {
      method: "POST",
      body: JSON.stringify({ title: input.title }),
    }));

  const slug = `announcement-${announcement.id.slice(0, 8)}`;
  const contentItem = await step("2. 콘텐츠 아이템 생성", () =>
    adminApi<{ id: string }>(`/admin/festivals/${festivalId}/content-items`, {
      method: "POST",
      body: JSON.stringify({
        contentType: "ANNOUNCEMENT",
        resourceType: "ANNOUNCEMENT",
        resourceId: announcement.id,
        slug,
      }),
    }));
  const version = await step("3. 콘텐츠 버전 생성", () =>
    adminApi<{ id: string }>(`/admin/festivals/${festivalId}/content-items/${contentItem.id}/versions`, {
      method: "POST",
      body: JSON.stringify({ language: "ko", body: { title: input.title } }),
    }));
  await step("4. 검수 제출", () =>
    adminApi(`/admin/festivals/${festivalId}/content-versions/${version.id}/submit`, { method: "POST" }));
  await step("5. 검수 승인", () =>
    adminApi(`/admin/festivals/${festivalId}/content-versions/${version.id}/reviews`, {
      method: "POST",
      body: JSON.stringify({ decision: "APPROVED", comment: "긴급 공지 자동 승인" }),
    }));

  return step("6. 공지 발행", () =>
    adminApi(`/admin/festivals/${festivalId}/announcements/${announcement.id}/publish`, {
      method: "POST",
      body: JSON.stringify({
        contentVersionId: version.id,
        severity: input.severity,
        audience: input.audience,
        targetAreaIds: input.targetAreaIds,
        startsAt: input.startsAt,
        endsAt: input.endsAt || null,
      }),
    }));
}

export async function closeAnnouncement(id: string) {
  const festivalId = await adminFestivalId();
  return adminApi(`/admin/festivals/${festivalId}/announcements/${id}/close`, { method: "POST" });
}
