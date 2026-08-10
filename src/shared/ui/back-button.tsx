"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="뒤로 가기"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-accent",
        className,
      )}
    >
      <ArrowLeft className="size-4" />
    </button>
  );
}
