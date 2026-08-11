"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, DoorOpen, Hourglass, Ticket as TicketIcon, ArrowRight, MapPinned } from "lucide-react";
import { fetchOpsSnapshot } from "@/widgets/dashboard-stats/data";
import { fetchTickets } from "@/entities/ticket";
import { fetchOperationResources } from "@/entities/program";
import { StatCard } from "@/shared/ui/stat-card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { NotificationAdminPanel } from "@/features/notification/ui/notification-admin-panel";
import { FestivalBriefCard } from "@/features/festival-brief/ui/festival-brief-card";

const PRIORITY_STYLE = {
  높음: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  중간: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  낮음: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
} as const;

export default function AdminDashboardPage() {
  const { data: ops, isLoading: opsLoading } = useQuery({ queryKey: ["ops-snapshot"], queryFn: fetchOpsSnapshot });
  const { data: tickets } = useQuery({ queryKey: ["tickets"], queryFn: fetchTickets });
  const { data: resources } = useQuery({ queryKey: ["operation-resources"], queryFn: fetchOperationResources });

  const openTickets = (tickets ?? []).filter((t) => t.status !== "완료").slice(0, 4);
  const issueResources = (resources ?? []).filter((r) => r.status === "이슈");

  const maxHourly = Math.max(...(ops?.hourlyEntries.map((h) => h.count) ?? [1]));

  return (
    <div className="space-y-6">
      <FestivalBriefCard />

      {opsLoading || !ops ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="오늘 예약" value={ops.reservationsToday.toLocaleString()} helper="누적 예약 건수" icon={CalendarCheck} tone="primary" />
          <StatCard label="오늘 입장" value={ops.entryToday.toLocaleString()} helper="QR 체크인 기준" icon={DoorOpen} />
          <StatCard label="평균 대기" value={`${ops.avgWaitMinutes}분`} helper="전체 프로그램 평균" icon={Hourglass} />
          <StatCard label="쿠폰 발급/사용" value={`${ops.couponsIssued} / ${ops.couponsUsed}`} helper="지역상권 디지털 쿠폰" icon={TicketIcon} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">시간대별 입장 현황</h2>
            <span className="text-xs text-muted-foreground">오늘 기준</span>
          </div>
          {opsLoading || !ops ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="flex h-40 items-end gap-2.5">
              {ops.hourlyEntries.map((h) => (
                <div key={h.hour} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-32 w-full items-end overflow-hidden rounded-md bg-muted">
                    <div
                      className="w-full rounded-md bg-primary transition-all"
                      style={{ height: `${(h.count / maxHourly) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{h.hour}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5">
          <div>
            <span className="grid size-10 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><MapPinned className="size-5" /></span>
            <h2 className="mt-4 text-sm font-bold text-foreground">지도 부스 지점</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">카카오맵에 노출할 부스·시설 좌표를 등록하고 공개 여부를 설정하세요.</p>
          </div>
          <Link href="/admin/map-locations" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-primary">지도 설정 열기 <ArrowRight className="size-3" /></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">처리 필요 민원·공지·사고</h2>
            <Link href="/admin/tickets" className="inline-flex items-center gap-0.5 text-xs font-medium text-primary">
              전체보기 <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {openTickets.length === 0 && <p className="text-xs text-muted-foreground">처리 대기 중인 티켓이 없어요.</p>}
            {openTickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.type} · {t.assignee} · {t.createdAt}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${PRIORITY_STYLE[t.priority]}`}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">운영 자원 이슈</h2>
            <Link href="/admin/programs" className="inline-flex items-center gap-0.5 text-xs font-medium text-primary">
              통합 운영관리 <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {issueResources.length === 0 && <p className="text-xs text-muted-foreground">현재 이슈가 없어요.</p>}
            {issueResources.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.category} · {r.location}</p>
                </div>
                <Badge variant="destructive" className="shrink-0 text-[10px]">{r.note}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NotificationAdminPanel />
    </div>
  );
}
