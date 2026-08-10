import type { Metadata } from "next";
import { VisitorTopbar } from "@/widgets/visitor-nav/visitor-topbar";
import { VisitorNav } from "@/widgets/visitor-nav/visitor-nav";

export const metadata: Metadata = {
  title: "FESTAI | 방문객 모바일 웹",
};

export default function VisitorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background">
      <VisitorTopbar />
      <main className="mx-auto min-h-0 w-full max-w-md flex-1 overflow-y-auto pb-4">{children}</main>
      <VisitorNav />
    </div>
  );
}
