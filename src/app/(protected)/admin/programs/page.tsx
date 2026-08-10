"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOperationResources } from "@/entities/program";
import type { OperationCategory } from "@/entities/program";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

const CATEGORIES: (OperationCategory | "전체")[] = ["전체", "프로그램", "참여업체", "부스", "인력", "자원봉사자"];

const STATUS_STYLE = {
  준비중: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  운영중: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  완료: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  이슈: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
} as const;

export default function ProgramsPage() {
  const { data: resources, isLoading } = useQuery({ queryKey: ["operation-resources"], queryFn: fetchOperationResources });
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("전체");

  const filtered = useMemo(() => {
    if (!resources) return [];
    return category === "전체" ? resources : resources.filter((r) => r.category === category);
  }, [resources, category]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    (resources ?? []).forEach((r) => map.set(r.category, (map.get(r.category) ?? 0) + 1));
    return map;
  }, [resources]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        프로그램, 참여업체, 부스, 인력, 자원봉사자 정보를 하나의 화면에서 통합 관리해요.
      </p>

      <Tabs value={category} onValueChange={(v) => setCategory(v as typeof category)}>
        <TabsList className="flex-wrap">
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c} value={c} className="gap-1.5">
              {c}
              {c !== "전체" && (
                <span className="text-[10px] text-muted-foreground">{counts.get(c) ?? 0}</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>구분</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead>시간</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{r.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{r.name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.manager}</TableCell>
                    <TableCell className="text-muted-foreground">{r.location}</TableCell>
                    <TableCell className="text-muted-foreground">{r.time}</TableCell>
                    <TableCell>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLE[r.status]}`}>
                        {r.status}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-muted-foreground">{r.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
