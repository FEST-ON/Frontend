"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DEMAND_LABEL,
  DEMAND_RATIO,
  DEMAND_TONE,
  REGION_OPTIONS,
  fetchDemandForecast,
  type DemandForecastInput,
  type Region,
} from "@/features/demand-forecast/api/demand-forecast";
import { useForm } from "@/shared/lib/use-form";
import { seoulDate } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SelectField } from "@/shared/ui/select-field";
import { StatusPill } from "@/shared/ui/status-pill";
import { Switch } from "@/shared/ui/switch";
import { Form, SubmitButton } from "@/shared/ui/form";
import { QueryState } from "@/shared/ui/query-state";

const DEFAULT_INPUT: DemandForecastInput = { dailyAverage: 5000, region: "OTHER", holidayDates: [], rainDates: [] };

function datesFrom(startDate: string, count: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !Number.isInteger(count) || count < 1 || count > 365) return [];
  const start = new Date(`${startDate}T00:00:00Z`);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
}

export default function DemandForecastPage() {
  const { form, set, field } = useForm({
    ...DEFAULT_INPUT,
    dailyAverage: String(DEFAULT_INPUT.dailyAverage),
    startDate: "",
    festivalDays: "3",
  });
  // 조회는 제출할 때만 나간다 — 일평균을 타이핑하는 동안 매 글자마다 부르지 않도록.
  const [input, setInput] = useState<DemandForecastInput>(DEFAULT_INPUT);

  const forecast = useQuery({
    queryKey: ["demand-forecast", input],
    queryFn: () => fetchDemandForecast(input),
    retry: 1,
  });

  const dailyAverage = Number(form.dailyAverage);
  const festivalDays = Number(form.festivalDays);
  const dates = datesFrom(form.startDate, festivalDays);
  const toggleDate = (key: "holidayDates" | "rainDates", date: string, checked: boolean) =>
    set(key)(checked ? [...form[key], date] : form[key].filter((value) => value !== date));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        개막 전에 일자별로 사람이 평소보다 몰릴지 봐요. 예측값은 방문객 수가 아니라 <b>이 축제 일평균 대비 배수</b>라서,
        인력 배치와 정원 설정의 기준으로 씁니다.
      </p>

      <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">예측 원리</p>
        <p className="mt-1">
          과거 축제의 일자 위치·주말·공휴일·규모·지역·우천 패턴을 ML로 비교해, 절대 인원이 아닌
          이 축제 일평균 대비 혼잡 구간을 예측해요.
        </p>
      </div>

      <Form
        className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-6"
        onSubmit={() => setInput({
          ...form,
          dailyAverage,
          festivalDays,
          holidayDates: form.holidayDates.filter((date) => dates.includes(date)),
          rainDates: form.rainDates.filter((date) => dates.includes(date)),
        })}
      >
        <div className="space-y-1">
          <Label htmlFor="start-date">시작 일자</Label>
          <Input id="start-date" type="date" required {...field("startDate")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="festival-days">축제 일수</Label>
          <Input id="festival-days" type="number" min={1} max={365} inputMode="numeric" required {...field("festivalDays")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="daily-average">예상 일평균 방문객</Label>
          <Input id="daily-average" type="number" min={1} inputMode="numeric" required {...field("dailyAverage")} />
        </div>
        <div className="space-y-1">
          <Label>지역</Label>
          <SelectField
            value={form.region}
            onValueChange={(value) => set("region")(value as Region)}
            options={[...REGION_OPTIONS]}
            aria-label="지역"
          />
        </div>
        <div className="space-y-2 sm:col-span-6">
          <div>
            <p className="text-sm font-medium text-foreground">날짜별 조건</p>
            <p className="text-xs text-muted-foreground">각 날짜가 공휴일이거나 비 예보가 있으면 해당 조건을 켜 주세요.</p>
          </div>
          {dates.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {dates.map((date) => (
                <div key={date} className="rounded-xl border border-border p-3">
                  <p className="mb-2 text-sm font-medium text-foreground">{seoulDate(date)}</p>
                  <div className="flex gap-4">
                    <Label className="flex items-center gap-2">
                      <Switch
                        checked={form.holidayDates.includes(date)}
                        onCheckedChange={(checked) => toggleDate("holidayDates", date, checked)}
                      />
                      휴일
                    </Label>
                    <Label className="flex items-center gap-2">
                      <Switch
                        checked={form.rainDates.includes(date)}
                        onCheckedChange={(checked) => toggleDate("rainDates", date, checked)}
                      />
                      우천
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">시작 일자와 축제 일수를 입력하면 날짜별 조건이 표시돼요.</p>
          )}
        </div>
        <SubmitButton mutation={forecast} pending="조회 중..." className="sm:col-span-6 sm:justify-self-start">
          예측 조회
        </SubmitButton>
      </Form>

      <QueryState query={forecast} empty="예측할 축제 일정이 없어요." emptyWhen={forecast.data?.days.length === 0}>
        {(data) => (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.days.map((day) => (
                <div key={day.date} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {day.dayNumber}일차 · {seoulDate(day.date)}
                    </p>
                    {day.label ? (
                      <StatusPill tone={DEMAND_TONE[day.label]}>{DEMAND_LABEL[day.label]}</StatusPill>
                    ) : (
                      <StatusPill tone="muted">예측 불가</StatusPill>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {day.label
                      ? `${DEMAND_RATIO[day.label]} · 신뢰도 ${Math.round((day.confidence ?? 0) * 100)}%`
                      : "조회표에 없는 조건이라 라벨을 내지 않았어요."}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.peakDays.length > 0
                ? `혼잡 예상일: ${data.peakDays.map(seoulDate).join(", ")} — 인력 배치를 이 날에 몰아 주세요.`
                : "일평균을 크게 넘는 날은 없어요."}
              {data.days[0]?.holdoutAccuracy !== undefined &&
                ` (모델 검증 정확도 ${Math.round(data.days[0].holdoutAccuracy * 100)}%)`}
            </p>
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <p><b className="text-foreground">신뢰도</b>는 입력 조건에서 ML이 선택한 혼잡 등급에 부여한 확률이에요. 실제 방문객 수의 오차 범위는 아니에요.</p>
              <p className="mt-1"><b className="text-foreground">모델 검증 정확도</b>는 과거 자료 중 학습에 쓰지 않은 20%를 맞힌 비율이에요.</p>
            </div>
          </div>
        )}
      </QueryState>
    </div>
  );
}
