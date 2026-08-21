"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readJson } from "@/shared/lib/local-store";

// useSyncExternalStore는 스냅샷이 값이 바뀔 때만 새 객체이길 요구한다(매번 새로 파싱하면
// 무한 렌더가 된다). 원문 문자열이 그대로면 지난 파싱 결과를 돌려준다.
const parsed = new Map<string, { raw: string | null; value: unknown }>();
// 서버 렌더 스냅샷도 같은 객체여야 하므로 키별로 처음 받은 기본값을 고정해 둔다.
const serverValues = new Map<string, unknown>();

function snapshot<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key);
  const cached = parsed.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  const value = readJson(key, fallback);
  parsed.set(key, { raw, value });
  return value;
}

function serverSnapshot<T>(key: string, fallback: T): T {
  if (!serverValues.has(key)) serverValues.set(key, fallback);
  return serverValues.get(key) as T;
}

/**
 * localStorage 값을 구독한다. 다른 탭(storage)과 같은 탭(writeJson이 쏘는 event) 모두 반영한다.
 *
 * 서버 렌더에서는 fallback을 쓰고 하이드레이션 뒤에 실제 값으로 바뀐다 — 저장소를 읽는
 * 화면이 서버·클라이언트에서 다르게 그려지는 문제를 React가 직접 처리해 준다.
 */
export function useStored<T>(key: string, fallback: T, event?: string): T {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("storage", onChange);
    if (event) window.addEventListener(event, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      if (event) window.removeEventListener(event, onChange);
    };
  }, [event]);
  return useSyncExternalStore(
    subscribe,
    () => snapshot(key, fallback),
    () => serverSnapshot(key, fallback),
  );
}
