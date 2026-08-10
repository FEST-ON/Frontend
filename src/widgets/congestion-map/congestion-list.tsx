import { cn } from "@/shared/lib/utils";
import type { CongestionZone } from "@/entities/festival";

const LEVEL_STYLE: Record<CongestionZone["level"], string> = {
  여유: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  보통: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  혼잡: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

const LEVEL_BAR: Record<CongestionZone["level"], string> = {
  여유: "bg-emerald-500 w-1/4",
  보통: "bg-amber-500 w-3/5",
  혼잡: "bg-red-500 w-11/12",
};

export function CongestionList({ zones }: { zones: CongestionZone[] }) {
  return (
    <div className="space-y-2.5">
      {zones.map((zone) => (
        <div key={zone.id} className="rounded-xl border border-border bg-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{zone.zone}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", LEVEL_STYLE[zone.level])}>
              {zone.level}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full transition-all", LEVEL_BAR[zone.level])} />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{zone.waitMinutes > 0 ? `평균 대기 ${zone.waitMinutes}분` : "대기 없음"}</span>
            <span>업데이트 {zone.updatedAt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
