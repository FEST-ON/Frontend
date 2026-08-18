"use client";

import { useEffect, useState } from "react";
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
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SelectField } from "@/shared/ui/select-field";
import { StatusPill } from "@/shared/ui/status-pill";
import { Switch } from "@/shared/ui/switch";
import { Form, SubmitButton } from "@/shared/ui/form";
import { QueryState } from "@/shared/ui/query-state";

const DEFAULT_INPUT: DemandForecastInput = { dailyAverage: 5000, region: "OTHER", holidayDates: [], rainDates: [] };

interface DayCard {
  holiday: boolean;
  rain: boolean;
}

/** 시작일 + 카드 순서로 날짜를 만든다 — 카드마다 날짜를 따로 들고 있지 않는다. */
function dateAt(startDate: string, index: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return "";
  const date = new Date(`${startDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + index);
  return date.toISOString().slice(0, 10);
}

export default function DemandForecastPage() {
  const { form, set, field } = useForm({
    ...DEFAULT_INPUT,
    dailyAverage: String(DEFAULT_INPUT.dailyAverage),
    startDate: "",
    days: [{ holiday: false, rain: false }] as DayCard[],
  });
  // 조회는 제출할 때만 나간다 — 일평균을 타이핑하는 동안 매 글자마다 부르지 않도록.
  const [input, setInput] = useState<DemandForecastInput>(DEFAULT_INPUT);

  const forecast = useQuery({
    queryKey: ["demand-forecast", input],
    queryFn: () => fetchDemandForecast(input),
    retry: 1,
  });

  // 시작일을 아직 고르지 않았으면 등록된 축제 일정으로 카드를 채워 준다.
  useEffect(() => {
    const registered = forecast.data?.days;
    if (form.startDate || !registered?.length) return;
    set("startDate")(registered[0].date);
    set("days")(registered.map(() => ({ holiday: false, rain: false })));
  }, [forecast.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const dailyAverage = Number(form.dailyAverage);
  const isSynthetic = forecast.data?.days[0]?.source?.startsWith("synthetic") ?? false;
  const setDay = (index: number, patch: Partial<DayCard>) =>
    set("days")(form.days.map((day, i) => (i === index ? { ...day, ...patch } : day)));
  const datesWhere = (key: keyof DayCard) =>
    form.days.flatMap((day, index) => (day[key] ? [dateAt(form.startDate, index)] : []));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        개막 전에 일자별 혼잡을 미리 봐요. 내는 값은 방문객 수가 아니라 <b>이 축제 일평균 대비 배수 구간</b>이라,
        인력 배치와 정원의 기준으로 씁니다.
      </p>

      <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">예측 방식</p>
        <ol className="mt-2 space-y-1.5">
          <li>
            <b className="text-foreground">1. 타깃</b> — 절대 방문객 수 대신 <b>그 축제 자신의 일평균 대비 배수</b>를
            네 구간(0.7 / 1.3 / 2.0배 경계)으로 나눈 분류 문제로 풉니다. 축제 간 규모가 100배 넘게 차이나서, 절대값을
            맞히는 모델은 큰 축제에만 맞고 작은 축제에서는 전부 빗나갑니다.
          </li>
          <li>
            <b className="text-foreground">2. 입력</b> — 일차 위치(첫날·중간·마지막), 주말, 공휴일, 축제 규모(일평균
            5천 / 5만 기준 3구간), 지역(수도권·광역시·그 외), 우천. 여섯 축 모두 저카디널리티라 가능한 조합이 216개뿐입니다.
          </li>
          <li>
            <b className="text-foreground">3. 모델</b> — 한국관광 데이터랩 축제 방문자 통계를 학습 데이터로 쓰고,
            분류기는 <b>TabPFN</b>입니다. 축제는 연 1회 3~5일이라 축제별 이력이 구조적으로 부족한데, TabPFN은 파라미터를
            새로 학습하는 대신 과거 관측을 컨텍스트로 받아 사후 예측 분포를 바로 내므로 이런 소규모·콜드스타트 표 데이터에 맞습니다.
          </li>
          <li>
            <b className="text-foreground">4. 서빙</b> — 216개 조합을 오프라인에서 전부 추론해 라벨과 확률을 JSON
            조회표로 굽고, 운영 서버는 조회 한 번만 합니다. 추론 런타임을 배포하지 않고, 이산화 규칙이 조회표에 함께
            실려 나가 학습·서빙 간 전처리 불일치가 생길 수 없습니다.
          </li>
        </ol>
      </div>

      {isSynthetic && (
        <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          현재 조회표는 실측 데이터가 아니라 배관 검증용 더미 데이터로 구워져 있어요. 실제 인력 배치 판단에 쓰지 마세요.
        </div>
      )}

      <Form
        className="space-y-4"
        onSubmit={() => setInput({
          dailyAverage,
          region: form.region,
          startDate: form.startDate || undefined,
          festivalDays: form.startDate ? form.days.length : undefined,
          holidayDates: datesWhere("holiday"),
          rainDates: datesWhere("rain"),
        })}
      >
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>지역</Label>
            <SelectField
              value={form.region}
              onValueChange={(value) => set("region")(value as Region)}
              options={[...REGION_OPTIONS]}
              aria-label="지역"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="daily-average">예상 일평균 방문객</Label>
            <Input id="daily-average" type="number" min={1} inputMode="numeric" required {...field("dailyAverage")} />
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium text-foreground">일자별 조건</p>
            <p className="text-xs text-muted-foreground">시작일을 정하고, 공휴일이거나 비 예보가 있는 날만 켜 주세요. 하루씩 카드를 늘려 기간을 만듭니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {form.days.map((day, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  {index === 0 ? (
                    <div className="space-y-1">
                      <Label htmlFor="start-date" className="text-xs text-muted-foreground">1일차 시작일</Label>
                      <Input id="start-date" type="date" required {...field("startDate")} />
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-foreground">
                      {index + 1}일차 · {dateAt(form.startDate, index) ? seoulDate(dateAt(form.startDate, index)) : "시작일 미정"}
                    </p>
                  )}
                  {index > 0 && index === form.days.length - 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      aria-label={`${index + 1}일차 삭제`}
                      onClick={() => set("days")(form.days.slice(0, -1))}
                    >
                      삭제
                    </Button>
                  )}
                </div>
                <div className="mt-3 flex gap-4">
                  <Label className="flex items-center gap-2">
                    <Switch checked={day.holiday} onCheckedChange={(checked) => setDay(index, { holiday: checked })} />
                    휴일
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Switch checked={day.rain} onCheckedChange={(checked) => setDay(index, { rain: checked })} />
                    우천
                  </Label>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="h-auto min-h-24 rounded-xl border-dashed"
              disabled={form.days.length >= 365}
              onClick={() => set("days")([...form.days, { holiday: false, rain: false }])}
            >
              + 다음 날 추가
            </Button>
          </div>
        </div>

        <SubmitButton mutation={forecast} pending="조회 중...">
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
                      : "조회표에 없는 조건이라 추정하지 않고 비워 뒀어요."}
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
            <details className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <summary className="cursor-pointer font-medium text-foreground">이 숫자를 어떻게 읽나</summary>
              <ul className="mt-2 space-y-1.5">
                <li>
                  <b className="text-foreground">신뢰도</b> — 그 조건에서 모델이 고른 등급의 예측 확률(argmax 확률)이에요.
                  별도 보정(calibration)은 하지 않았고, 방문객 수의 오차 범위도 아닙니다.
                </li>
                <li>
                  <b className="text-foreground">모델 검증 정확도</b> — 고정 시드로 20%를 떼어 낸 홀드아웃의 top-1 정확도예요.
                  4개 클래스라 무작위 추측이 0.25고, 분할이 축제 단위가 아니라 일자 단위라 같은 축제의 다른 날이 학습 쪽에
                  들어갈 수 있어 실제 신규 축제 성능보다 낙관적일 수 있습니다.
                </li>
                <li>
                  <b className="text-foreground">한계</b> — 축제별 고유 패턴은 반영하지 않는, 일반적인 문화관광축제의 평균
                  거동이에요. 입력한 예상 일평균이 틀리면 모든 라벨이 함께 틀립니다(라벨이 그 값 대비 배수이므로).
                  개막 후 실시간 혼잡 보정은 이 기능의 범위 밖입니다.
                </li>
              </ul>
            </details>
          </div>
        )}
      </QueryState>
    </div>
  );
}
