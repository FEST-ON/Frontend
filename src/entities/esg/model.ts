export type EsgPillar = "환경" | "사회" | "거버넌스";

export interface EsgMetric {
  id: string;
  pillar: EsgPillar;
  name: string;
  value: number;
  unit: string;
  target: number;
  source: string;
  approved: boolean;
  approvedAt: string | null;
  trend: number[];
}

export interface EsgReportSection {
  pillar: EsgPillar;
  summary: string;
  highlights: string[];
}
