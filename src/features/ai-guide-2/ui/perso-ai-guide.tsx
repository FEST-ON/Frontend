"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bus,
  CalendarDays,
  MapPin,
  Mic,
  RotateCcw,
  SendHorizontal,
  Square,
  Sparkles,
  Users,
  Volume2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { AccessibilitySheet } from "@/features/accessibility/ui/accessibility-sheet";
import { useAccessibilityStore } from "@/features/accessibility/model/store";
import { buildPersoMessage, generatePersoReply } from "../lib/generate-reply";
import { usePersoChatStore } from "../model/chat-store";
import { useSpeechRecognition } from "../model/use-speech-recognition";

const EXPECTED_QUESTIONS = [
  { icon: Users, label: "지금 가장 혼잡한 곳은?" },
  { icon: Bus, label: "셔틀버스 이용 방법" },
  { icon: MapPin, label: "가까운 화장실 안내" },
  { icon: CalendarDays, label: "오늘 주요 프로그램" },
] as const;

export function PersoAiGuide() {
  const router = useRouter();
  const { messages, isTyping, addMessage, setTyping, reset } = usePersoChatStore();
  const { language, largeText, voiceGuide } = useAccessibilityStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");

  const estimatedConversationHeight = messages.slice(-3).reduce((height, message) => {
    const charactersPerLine = largeText ? 27 : 38;
    const lineHeight = largeText ? 26 : 20;
    return height + 34 + Math.ceil(message.content.length / charactersPerLine) * lineHeight;
  }, 0);
  const chatPanelHeight = Math.min(430, Math.max(292, 200 + estimatedConversationHeight));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleAsk = useCallback((question: string) => {
    if (isTyping) return;

    addMessage(buildPersoMessage("user", question));
    setTyping(true);

    window.setTimeout(() => {
      const reply = generatePersoReply(question);
      addMessage(buildPersoMessage("assistant", reply.content, reply.sources));
      setTyping(false);
    }, 650);
  }, [addMessage, isTyping, setTyping]);

  const handleVoiceResult = useCallback((transcript: string) => {
    setDraft("");
    handleAsk(transcript);
  }, [handleAsk]);

  const {
    error: speechError,
    interimTranscript,
    isListening,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({ language, onFinalResult: handleVoiceResult });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = draft.trim();
    if (!question || isTyping || isListening) return;

    setDraft("");
    handleAsk(question);
  }

  return (
    <section className="relative isolate flex h-full min-h-0 flex-col overflow-hidden bg-slate-950 text-white">
      <Image
        src="/images/perso-ai-guide.png"
        alt="Perso AI 축제 안내 디지털 휴먼 예시"
        fill
        priority
        sizes="(max-width: 448px) 100vw, 448px"
        className="-z-10 object-cover object-[center_10%]"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-slate-950/10 via-slate-950/5 to-slate-950/50" />

      <button
        type="button"
        aria-label="이전 화면으로 돌아가기"
        onClick={() => router.back()}
        className="absolute left-4 top-4 z-30 flex size-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/40 text-white backdrop-blur-md transition hover:bg-slate-950/60"
      >
        <ArrowLeft className="size-5" />
      </button>

      <div className="absolute left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-slate-950/45 px-3 py-2 text-[11px] font-semibold text-white/90 backdrop-blur-md">
        <Volume2 className="size-3.5 text-cyan-300" />
        음성 안내 준비됨
      </div>

      <div className="absolute right-4 top-4 z-30 flex items-center gap-2">
        <AccessibilitySheet triggerClassName="size-10 border-white/20 bg-slate-950/40 text-white backdrop-blur-md hover:bg-slate-950/60 hover:text-white" />
        <button
          type="button"
          aria-label="대화 새로고침"
          onClick={reset}
          className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/40 text-white backdrop-blur-md transition hover:bg-slate-950/60"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col overflow-hidden rounded-t-[30px] border-t border-white/45 bg-white/70 text-foreground shadow-[0_-18px_52px_rgba(15,23,42,0.38)] backdrop-blur-xl transition-[height] duration-300 ease-out dark:bg-slate-950/68"
        style={{ height: chatPanelHeight }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-linear-to-b from-white/90 via-white/40 to-transparent dark:from-slate-950/85 dark:via-slate-950/35" />

        <div
          className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-3 pt-8"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0, black 36px, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 36px, black 100%)",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[84%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line shadow-sm",
                  largeText && "text-base leading-loose",
                  message.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md border border-white/55 bg-white/78 text-card-foreground backdrop-blur-md dark:border-white/10 dark:bg-slate-900/72",
                )}
              >
                {message.role === "assistant" && (
                  <span className="mb-1 flex items-center gap-1 text-[10px] font-bold text-primary">
                    <Sparkles className="size-3" /> PERSO
                  </span>
                )}
                {message.content}
                {message.sources && message.sources.length > 0 && (
                  <p className="mt-1.5 border-t border-border/70 pt-1.5 text-[9px] opacity-60">
                    출처 · {message.sources.join(", ")}
                  </p>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className="size-1.5 animate-bounce rounded-full bg-primary/60"
                    style={{ animationDelay: `${index * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="relative z-30 shrink-0 bg-transparent px-4 pb-2 pt-1.5">
          <form
            onSubmit={handleSubmit}
            className={cn(
              "flex items-center gap-1.5 rounded-2xl border border-white/60 bg-white/82 p-1.5 shadow-sm backdrop-blur-md transition dark:border-white/10 dark:bg-slate-900/78",
              isListening && "border-red-400/70 ring-2 ring-red-400/15",
            )}
          >
            <input
              value={isListening ? interimTranscript : draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={isTyping || isListening}
              aria-label="Perso AI에게 질문하기"
              placeholder={isListening ? "듣고 있어요..." : "말하거나 직접 질문하세요"}
              className={cn(
                "min-w-0 flex-1 bg-transparent px-2 text-[12px] font-medium text-foreground outline-none placeholder:text-muted-foreground/75 disabled:opacity-80",
                largeText && "text-sm",
              )}
            />
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isTyping || !isSpeechSupported}
              aria-label={isListening ? "음성인식 중지" : "음성으로 질문하기"}
              aria-pressed={isListening}
              className={cn(
                "relative flex size-9 shrink-0 items-center justify-center rounded-full text-white transition disabled:cursor-not-allowed disabled:opacity-35",
                isListening ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90",
              )}
            >
              {isListening && <span className="absolute inset-0 animate-ping rounded-full bg-red-400/35" />}
              {isListening ? <Square className="relative size-3.5 fill-current" /> : <Mic className="size-4" />}
            </button>
            <button
              type="submit"
              disabled={!draft.trim() || isTyping || isListening}
              aria-label="질문 전송"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-slate-900"
            >
              <SendHorizontal className="size-4" />
            </button>
          </form>

          <p
            aria-live="polite"
            className={cn(
              "min-h-4 px-1 pt-1 text-[9px] font-medium text-muted-foreground",
              speechError && "text-red-600 dark:text-red-300",
              isListening && "text-red-600 dark:text-red-300",
            )}
          >
            {speechError ??
              (isListening
                ? "음성을 인식하고 있어요. 질문이 끝나면 자동으로 전송됩니다."
                : isSpeechSupported
                  ? "마이크를 누르고 질문하면 인식 후 자동으로 전송돼요."
                  : "현재 브라우저에서는 텍스트 질문을 이용해주세요.")}
          </p>

          <p className={cn("mb-1.5 text-[10px] font-bold tracking-[0.12em] text-muted-foreground", largeText && "text-xs")}>
            예상 질문
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {EXPECTED_QUESTIONS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                disabled={isTyping}
                onClick={() => handleAsk(label)}
                className={cn(
                  "flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-white/55 bg-white/72 px-3 py-1.5 text-left text-[11px] font-semibold text-foreground shadow-sm backdrop-blur-md transition hover:border-primary/40 hover:bg-white/90 disabled:opacity-50 dark:border-white/10 dark:bg-slate-900/68",
                  largeText && "text-sm",
                )}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-3.5" />
                </span>
                <span className="leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {voiceGuide && <span className="sr-only" aria-live="polite">음성 안내가 켜졌습니다.</span>}
    </section>
  );
}
