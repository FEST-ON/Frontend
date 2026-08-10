import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  QrCode,
  Leaf,
  ArrowRight,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Logo } from "@/shared/ui/logo";
import { Badge } from "@/shared/ui/badge";
import { festivalInfo } from "@/entities/festival";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI 축제 안내",
    desc: "일정·교통·시설·안전 정보를 자연어로 안내하고, 동행유형·관심사 기반 맞춤 코스를 추천해요.",
  },
  {
    icon: LayoutDashboard,
    title: "통합 운영관리",
    desc: "프로그램·업체·부스·인력·자원봉사자를 한 화면에서, 민원·사고는 티켓으로 관리해요.",
  },
  {
    icon: QrCode,
    title: "방문객 QR 모바일 웹",
    desc: "앱 설치 없이 지도·예약·대기표·스탬프투어·디지털 쿠폰까지 한 번에 이용해요.",
  },
  {
    icon: Leaf,
    title: "ESG 성과관리",
    desc: "다회용기·분리배출·대중교통 데이터를 자동 집계하고 ESG 보고서 초안을 생성해요.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-linear-to-b from-blue-50 via-background to-background dark:from-blue-950/20">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <Badge variant="secondary" className="hidden gap-1.5 sm:inline-flex">
          <ShieldCheck className="size-3.5" />
          {festivalInfo.organizer} 공식 데모
        </Badge>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20">
        <section className="flex flex-col items-center gap-6 pt-10 pb-16 text-center">
          <Badge className="gap-1.5 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300">
            <Sparkles className="size-3.5" />
            AI · ESG 기반 지역축제 DX 플랫폼
          </Badge>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            축제 운영의 신뢰를 잇는,
            <br />
            <span className="text-primary">FESTAI</span>
          </h1>

          <div className="mt-2 grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/visitor"
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-100 text-primary dark:bg-blue-950">
                <Users className="size-5" />
              </span>
              <span className="text-base font-bold text-foreground">
                방문객으로 둘러보기
              </span>
              <span className="text-sm text-muted-foreground">
                30대 방문객 시나리오 · QR 모바일 웹 체험
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                시작하기{" "}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/admin"
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-100 text-primary dark:bg-blue-950">
                <LayoutDashboard className="size-5" />
              </span>
              <span className="text-base font-bold text-foreground">
                운영자로 로그인
              </span>
              <span className="text-sm text-muted-foreground">
                축제 담당 주무관 시나리오 · 통합 운영 대시보드
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                시작하기{" "}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-blue-200/60 bg-blue-600 p-8 text-primary-foreground shadow-lg sm:p-10 dark:border-blue-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">
                {festivalInfo.period.start} ~ {festivalInfo.period.end}
              </p>
              <h2 className="mt-1 text-2xl font-bold">{festivalInfo.name}</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-blue-100">
                {festivalInfo.description}
              </p>
            </div>
            <Link
              href="/visitor"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-sm transition-transform hover:scale-[1.02]"
            >
              방문객 화면 보기 <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        FESTAI Demo · Perso AI · 앨런(Alan) 연동 예정 · Powered by Next.js &
        Vercel
      </footer>
    </div>
  );
}
