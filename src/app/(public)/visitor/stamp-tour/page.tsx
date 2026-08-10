"use client";

import { Stamp, MapPin, Ticket, PartyPopper } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ProgressRing } from "@/shared/ui/progress-ring";
import { stampSpots } from "@/entities/coupon";
import { localCoupons } from "@/entities/coupon";
import { useStampTourStore } from "@/features/stamp-tour/model/store";

export default function StampTourPage() {
  const { collectedIds, collect } = useStampTourStore();
  const total = stampSpots.length;
  const collected = collectedIds.length;
  const complete = collected >= total;

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-lg font-extrabold text-foreground">스탬프 투어</h1>
      <p className="text-xs text-muted-foreground">스탬프를 모두 모으면 지역상권 쿠폰을 드려요</p>

      <div className="mt-4 flex flex-col items-center rounded-2xl border border-border bg-card py-6">
        <ProgressRing value={(collected / total) * 100} label={`${collected}/${total}`} sublabel="스탬프 수집" />
        {complete && (
          <Badge className="mt-3 gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">
            <PartyPopper className="size-3.5" /> 스탬프 완주! 아래 쿠폰을 확인하세요
          </Badge>
        )}
      </div>

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-bold text-foreground">스탬프 지점</h2>
        <div className="space-y-2">
          {stampSpots.map((spot) => {
            const done = collectedIds.includes(spot.id);
            return (
              <div key={spot.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-9 items-center justify-center rounded-full ${
                      done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Stamp className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{spot.name}</p>
                    <p className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <MapPin className="size-3" /> {spot.location}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant={done ? "secondary" : "default"} disabled={done} onClick={() => collect(spot.id)}>
                  {done ? "완료" : "스탬프 찍기"}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-foreground">
          <Ticket className="size-4" /> 지역상권 디지털 쿠폰
        </h2>
        <div className="space-y-2">
          {localCoupons.map((c) => (
            <div
              key={c.id}
              className={`rounded-xl border p-3 ${c.used ? "border-border bg-muted/50 opacity-60" : "border-primary/30 bg-blue-50 dark:bg-blue-950/20"}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">{c.store}</p>
                <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
              </div>
              <p className="mt-1 text-sm font-semibold text-primary">{c.discount}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.location} · {c.expiresAt}까지</p>
              {c.used && <p className="mt-1 text-[11px] font-medium text-muted-foreground">사용완료</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
