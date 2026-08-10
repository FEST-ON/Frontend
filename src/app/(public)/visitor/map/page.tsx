"use client";

import { useQuery } from "@tanstack/react-query";
import { Bus, Car, MapPin, TrainFront } from "lucide-react";
import {
  fetchCongestion,
  fetchFacilities,
  fetchTransport,
} from "@/entities/festival";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { CongestionList } from "@/widgets/congestion-map/congestion-list";

const TRANSPORT_ICON = {
  지하철: TrainFront,
  버스: Bus,
  셔틀: Bus,
  주차: Car,
} as const;

const STATUS_STYLE = {
  원활: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  보통: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  지연: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  혼잡: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
} as const;

export default function VisitorMapPage() {
  const { data: congestion, isLoading: cLoading } = useQuery({
    queryKey: ["congestion"],
    queryFn: fetchCongestion,
  });
  const { data: facilities, isLoading: fLoading } = useQuery({
    queryKey: ["facilities"],
    queryFn: fetchFacilities,
  });
  const { data: transport, isLoading: tLoading } = useQuery({
    queryKey: ["transport"],
    queryFn: fetchTransport,
  });

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-lg font-extrabold text-foreground">
        디지털 지도 · 시설정보
      </h1>
      <p className="text-xs text-muted-foreground">
        실시간 혼잡도와 편의시설, 교통정보를 확인하세요
      </p>

      <div className="relative mt-4 h-48 overflow-hidden rounded-2xl border border-border bg-[#f7f8f5]">
        {/* 목업 이미지 */}
        <svg
          viewBox="0 0 400 200"
          className="absolute inset-0 size-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="400" height="200" fill="#f7f8f5" />
          <rect x="230" y="0" width="170" height="200" fill="#e3f0fb" />
          <polygon points="230,0 400,0 400,90 230,190" fill="#eef3ee" />
          <g stroke="#dfe2dc" strokeWidth="14">
            <line x1="0" y1="40" x2="130" y2="40" />
            <line x1="60" y1="0" x2="60" y2="200" />
            <line x1="150" y1="20" x2="230" y2="130" />
          </g>
          <g fill="#c7cabf">
            <rect x="18" y="55" width="34" height="26" rx="2" />
            <rect x="6" y="120" width="40" height="30" rx="2" />
            <rect x="60" y="150" width="30" height="24" rx="2" />
            <rect x="150" y="60" width="46" height="16" rx="2" />
          </g>
          <circle cx="80" cy="30" r="9" fill="#5b7fa6" />
          <circle cx="130" cy="145" r="9" fill="#5b7fa6" />
          <circle cx="255" cy="140" r="9" fill="#c96a9a" />
          <g>
            <path
              d="M200 70 C200 55 213 43 228 43 C243 43 256 55 256 70 C256 90 228 118 228 118 C228 118 200 90 200 70 Z"
              fill="#2f7bf6"
            />
            <circle cx="228" cy="70" r="9" fill="#ffffff" />
          </g>
          <text x="10" y="192" fontSize="11" fill="#9aa096" fontWeight="700">
            30m
          </text>
          <line
            x1="10"
            y1="182"
            x2="70"
            y2="182"
            stroke="#9aa096"
            strokeWidth="1.5"
          />
        </svg>

        <span className="absolute right-2 bottom-1.5 text-[10px] font-semibold text-muted-foreground/70">
          kakao
        </span>
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[10px] font-medium text-muted-foreground shadow-sm">
          <MapPin className="size-3" />
          지도 목업 (데모 이미지)
        </span>
      </div>

      <Tabs defaultValue="congestion" className="mt-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="congestion">혼잡도</TabsTrigger>
          <TabsTrigger value="facility">편의시설</TabsTrigger>
          <TabsTrigger value="transport">교통</TabsTrigger>
        </TabsList>

        <TabsContent value="congestion" className="mt-3 space-y-2.5">
          {cLoading || !congestion ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            <CongestionList zones={congestion} />
          )}
        </TabsContent>

        <TabsContent value="facility" className="mt-3 space-y-2">
          {fLoading || !facilities ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            facilities.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {f.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{f.location}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-[10px]">
                    {f.type}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    도보 {f.walkMinutes}분
                  </span>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="transport" className="mt-3 space-y-2">
          {tLoading || !transport ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            transport.map((t) => {
              const Icon = TRANSPORT_ICON[t.mode];
              return (
                <div
                  key={t.id}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-primary dark:bg-blue-950">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {t.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.detail}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[t.status]}`}
                  >
                    {t.status}
                  </span>
                </div>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
