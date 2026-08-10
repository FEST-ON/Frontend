import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  QrCode,
  Leaf,
  ArrowRight,
  ShieldCheck,
  Users,
  Lock,
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
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-linear-to-b from-blue-50 via-background to-background dark:from-blue-950/20">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="w-full flex items-center justify-between gap-2">
          <Logo />
          <Link
            href="/admin"
            title="운영자 로그인"
            aria-label="운영자 로그인"
            className="rounded-full size-10 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
          >
            {/* <Lock className="size-3.5" /> */}
          </Link>
        </div>
        <Badge variant="secondary" className="hidden gap-1.5 sm:inline-flex">
          <ShieldCheck className="size-3.5" />
          {festivalInfo.organizer} 공식 데모
        </Badge>
      </header>

      <main className="mx-auto flex w-full min-h-0 max-w-6xl flex-1 flex-col justify-center px-6 pb-6">
        <section className="flex flex-col items-center gap-4 text-center">
          <Badge className="h-auto gap-1.5 bg-blue-100 px-4 py-2 text-md font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 [&>svg]:size-4!">
            <Sparkles className="size-4" />
            AI · ESG 기반 지역축제 DX 플랫폼
          </Badge>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-12 tracking-tight text-foreground sm:text-5xl">
            축제 운영의 신뢰를 잇는,
            <br />
            <span className="text-primary">FESTAI</span>
          </h1>
        </section>

        <section className="mt-8 rounded-3xl border border-blue-200/60 bg-blue-600 p-8 text-primary-foreground shadow-lg sm:p-10 dark:border-blue-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-100">
                {festivalInfo.period.start} ~ {festivalInfo.period.end}
              </p>
              <h2 className="mt-1 text-2xl font-bold">{festivalInfo.name}</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-blue-100">
                {festivalInfo.description}
              </p>
            </div>
            <Link
              href="/visitor"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-5 py-4 text-lg font-bold text-primary shadow-sm transition-transform hover:scale-[1.02]"
            >
              방문객으로 둘러보기 <ArrowRight className="size-4" />
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
