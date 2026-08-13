import { createHash } from "node:crypto";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { Locale } from "../locale";

// Verify this model slug against `curl https://ai-gateway.vercel.sh/v1/models`
// once AI_GATEWAY_API_KEY is configured — pick the newest available Haiku-class model.
const TRANSLATION_MODEL = "anthropic/claude-haiku-4-5";

const LOCALE_NAME: Record<Locale, string> = {
  ko: "Korean",
  en: "English",
  zh: "Simplified Chinese",
  ja: "Japanese",
};

function hashEntries(entries: Record<string, string>) {
  const sorted = Object.keys(entries)
    .sort()
    .map((key) => `${key}=${entries[key]}`)
    .join("\n");
  return createHash("sha256").update(sorted).digest("hex").slice(0, 24);
}

// In-memory fallback used whenever Vercel Runtime Cache isn't available
// (e.g. local `next dev`, or a region without the cache provisioned).
const memoryCache = new Map<string, Record<string, string>>();

async function readCache(key: string): Promise<Record<string, string> | undefined> {
  try {
    const { getCache } = await import("@vercel/functions");
    const cached = await getCache().get(key);
    if (cached) return cached as Record<string, string>;
  } catch {
    // Runtime Cache unavailable in this context — fall through to memory cache.
  }
  return memoryCache.get(key);
}

async function writeCache(key: string, locale: Locale, value: Record<string, string>) {
  memoryCache.set(key, value);
  try {
    const { getCache } = await import("@vercel/functions");
    await getCache().set(key, value, {
      ttl: 60 * 60 * 24 * 7,
      tags: [`i18n-${locale}`],
      name: "i18n-translation",
    });
  } catch {
    // Runtime Cache unavailable — memory cache above is the fallback.
  }
}

/**
 * Translates a flat map of { key: koreanText } into the target locale using an LLM,
 * caching results by (locale, content hash) so identical admin-authored content is
 * only ever translated once.
 */
export async function translateEntries(
  entries: Record<string, string>,
  locale: Locale,
): Promise<Record<string, string>> {
  if (locale === "ko") return entries;
  const keys = Object.keys(entries);
  if (keys.length === 0) return entries;

  const cacheKey = `i18n:${locale}:${hashEntries(entries)}`;
  const cached = await readCache(cacheKey);
  if (cached) return cached;

  const schema = z.object(Object.fromEntries(keys.map((key) => [key, z.string()])));

  const { output } = await generateText({
    model: TRANSLATION_MODEL,
    output: Output.object({ schema }),
    system:
      `You translate short UI/content strings for a Korean local festival visitor app from Korean into ${LOCALE_NAME[locale]}. ` +
      "Keep translations natural, concise, and appropriate for mobile app copy. Preserve place names, brand names, and numbers " +
      "sensibly. Return a translation for every key you are given — do not omit or add keys.",
    prompt: JSON.stringify(entries),
  });

  await writeCache(cacheKey, locale, output);
  return output;
}
