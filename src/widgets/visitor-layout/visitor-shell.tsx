"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { VisitorNav } from "@/widgets/visitor-nav/visitor-nav";
import { VisitorTopbar } from "@/widgets/visitor-nav/visitor-topbar";

export function VisitorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isImmersiveAiGuide = pathname === "/visitor/ai-guide" || pathname === "/visitor/ai-guide-2";

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background">
      {!isImmersiveAiGuide && <VisitorTopbar />}
      <main
        className={cn(
          "mx-auto min-h-0 w-full max-w-md flex-1",
          isImmersiveAiGuide ? "overflow-hidden" : "overflow-y-auto pb-4",
        )}
      >
        {children}
      </main>
      <VisitorNav />
    </div>
  );
}
