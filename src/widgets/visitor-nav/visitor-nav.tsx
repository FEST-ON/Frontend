"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, MapPin, Ticket, Stamp } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const NAV_ITEMS = [
  { href: "/visitor", label: "홈", icon: Home },
  { href: "/visitor/ai-guide-2", label: "AI안내", icon: Sparkles },
  { href: "/visitor/map", label: "지도", icon: MapPin },
  { href: "/visitor/reservation", label: "예약", icon: Ticket },
  { href: "/visitor/stamp-tour", label: "스탬프", icon: Stamp },
] as const;

export function VisitorNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/visitor" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("size-5", active && "fill-primary/15")} strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
