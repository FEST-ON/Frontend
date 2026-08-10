"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Clock, MapPin } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { fetchRecommendedCourse } from "@/entities/visitor";
import type { CompanionType, VisitorInterest } from "@/entities/visitor";

const COMPANIONS: CompanionType[] = ["혼자", "연인", "가족", "친구", "반려동물"];
const INTERESTS: VisitorInterest[] = ["공연", "체험", "푸드", "전시", "쇼핑"];
const DURATIONS = ["1시간", "2시간", "3시간", "종일"];

export function CourseRecommender() {
  const [companion, setCompanion] = useState<CompanionType>("가족");
  const [interests, setInterests] = useState<VisitorInterest[]>(["체험", "푸드"]);
  const [duration, setDuration] = useState("3시간");
  const [requested, setRequested] = useState(false);

  const { data: course, isFetching } = useQuery({
    queryKey: ["recommended-course", companion, interests, duration],
    queryFn: fetchRecommendedCourse,
    enabled: requested,
  });

  function toggleInterest(interest: VisitorInterest) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  }

  return (
    <div className="space-y-5 px-4 pb-6 pt-4">
      <div>
        <p className="mb-2 text-xs font-bold text-foreground">누구와 함께 가시나요?</p>
        <div className="flex flex-wrap gap-2">
          {COMPANIONS.map((c) => (
            <button
              key={c}
              onClick={() => setCompanion(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                companion === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-foreground">관심사를 선택하세요 (복수 선택)</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <button
              key={i}
              onClick={() => toggleInterest(i)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                interests.includes(i) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-foreground">체류 예정 시간</p>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                duration === d ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full gap-1.5" onClick={() => setRequested(true)}>
        <Sparkles className="size-4" /> 맞춤 코스 추천받기
      </Button>

      {isFetching && (
        <div className="space-y-2 pt-2">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      )}

      {!isFetching && course && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> AI 추천 코스
          </div>
          <h3 className="mt-1 text-base font-bold text-foreground">{course.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{course.matchReason}</p>

          <ol className="mt-4 space-y-4 border-l-2 border-dashed border-primary/30 pl-4">
            {course.stops.map((stop) => (
              <li key={stop.order} className="relative">
                <span className="absolute -left-[22px] top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {stop.order}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Clock className="size-3 text-muted-foreground" /> {stop.time} · {stop.title}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="size-3" /> {stop.location} · {stop.note}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
