import type { MoodResult } from "@/lib/mood-schema";
import {
  matchMusicByMemory,
  MUSIC_COVER_PLACEHOLDER,
  type MusicMemoryRecommendation,
  type MusicSong,
} from "@/lib/music-library";
import {
  spaceMemoryTaxonomy,
  type SpaceMemoryType,
} from "@/lib/space-memory-taxonomy";
import { routeSpaceMemoryType } from "@/lib/space-memory-router";
import {
  extractVisualGrounding,
  type NormalizedMusicContext,
} from "@/lib/visual-grounding";

type NeteaseSearchSong = {
  id?: number | string;
  name?: string;
  ar?: Array<{ name?: string }>;
  al?: { name?: string; picUrl?: string };
};

type DynamicSong = {
  songId: string;
  title: string;
  artist: string;
  coverUrl: string;
  songUrl: string;
  album?: string;
};

const MAX_SEARCH_QUERIES = 4;
const CANDIDATES_PER_QUERY = 5;
const FINAL_COUNT = 3;

export async function searchMusicByMood(
  result: MoodResult,
): Promise<MusicMemoryRecommendation[]> {
  const context = extractVisualGrounding(result);
  const memoryTypes = routeSpaceMemoryType(context);
  const queries = buildSearchQueries(context, memoryTypes);

  if (!queries.length) {
    return matchMusicByMemory(result);
  }

  try {
    const candidates = await searchNeteaseMultiQuery(queries);
    if (!candidates.length) return matchMusicByMemory(result);

    const recommendations = await curateTopPicks(
      candidates,
      context,
      memoryTypes[0],
    );

    return recommendations.length >= FINAL_COUNT
      ? recommendations
      : [...recommendations, ...matchMusicByMemory(result)].slice(0, FINAL_COUNT);
  } catch (error) {
    console.warn("[HearSpace Music] Dynamic search failed, using fallback:", error);
    return matchMusicByMemory(result);
  }
}

function buildSearchQueries(
  context: NormalizedMusicContext,
  memoryTypes: SpaceMemoryType[],
): string[] {
  const queries: string[] = [];

  for (const type of memoryTypes) {
    const category = spaceMemoryTaxonomy.find((c) => c.id === type);
    if (!category) continue;

    const artists = category.musicUniverse
      .filter((u) => !u.includes(" ") || u.length <= 6)
      .slice(0, 2);
    const genres = category.musicUniverse
      .filter((u) => u.includes(" ") || u.length > 6)
      .slice(0, 1);

    for (const artist of artists) {
      queries.push(artist);
    }
    for (const genre of genres) {
      queries.push(genre);
    }
  }

  const emotionQueries = context.emotionalTone
    .filter((e) => e.length >= 2 && e.length <= 4)
    .slice(0, 2)
    .map((e) => `${e} 华语`);
  queries.push(...emotionQueries);

  if (context.sceneType && context.sceneType.length >= 2) {
    queries.push(`${context.sceneType} 华语`);
  }

  return [...new Set(queries)].slice(0, MAX_SEARCH_QUERIES);
}

async function searchNeteaseMultiQuery(
  queries: string[],
): Promise<DynamicSong[]> {
  const mod = await import("NeteaseCloudMusicApi");
  const cloudsearch =
    mod.cloudsearch ??
    (mod as { default?: { cloudsearch?: typeof mod.cloudsearch } }).default
      ?.cloudsearch;

  if (typeof cloudsearch !== "function") return [];

  const results = await Promise.all(
    queries.map(async (keyword) => {
      try {
        const result = (await cloudsearch({
          keywords: keyword,
          limit: CANDIDATES_PER_QUERY,
          type: 1,
        })) as { body?: { result?: { songs?: NeteaseSearchSong[] } } };

        return (result.body?.result?.songs ?? []).map(normalizeDynamicSong).filter(
          (s): s is DynamicSong => s !== null,
        );
      } catch {
        return [];
      }
    }),
  );

  const seen = new Set<string>();
  const merged: DynamicSong[] = [];

  for (const batch of results) {
    for (const song of batch) {
      if (seen.has(song.songId)) continue;
      seen.add(song.songId);
      merged.push(song);
    }
  }

  return merged.slice(0, 15);
}

function normalizeDynamicSong(song: NeteaseSearchSong): DynamicSong | null {
  const songId = song.id ? String(song.id) : "";
  const title = song.name?.trim() || "";
  const artist = (song.ar ?? [])
    .map((a) => a.name?.trim())
    .filter((a): a is string => Boolean(a))
    .join(" / ");

  if (!songId || !title) return null;

  let coverUrl = song.al?.picUrl || "";
  if (coverUrl.startsWith("//")) coverUrl = `https:${coverUrl}`;
  coverUrl = coverUrl.replace(/^http:\/\//, "https://") || MUSIC_COVER_PLACEHOLDER;

  return {
    songId,
    title,
    artist,
    coverUrl,
    songUrl: `https://music.163.com/#/song?id=${songId}`,
    album: song.al?.name?.trim() || undefined,
  };
}

async function curateTopPicks(
  candidates: DynamicSong[],
  context: NormalizedMusicContext,
  primaryType: SpaceMemoryType,
): Promise<MusicMemoryRecommendation[]> {
  if (candidates.length <= FINAL_COUNT) {
    return candidates.map((s, i) => toRecommendation(s, context, primaryType, i));
  }

  const useQwen =
    process.env.MUSIC_USE_QWEN_CURATOR === "true" && process.env.DASHSCOPE_API_KEY;
  if (useQwen) {
    try {
      return await qwenCurate(candidates, context, primaryType);
    } catch (error) {
      console.warn("[HearSpace Music] Qwen curation failed:", error);
    }
  }

  return ruleBasedCurate(candidates, context, primaryType);
}

function ruleBasedCurate(
  candidates: DynamicSong[],
  context: NormalizedMusicContext,
  primaryType: SpaceMemoryType,
): MusicMemoryRecommendation[] {
  const category = spaceMemoryTaxonomy.find((c) => c.id === primaryType);
  const preferredArtists = new Set(
    category?.musicUniverse.filter((u) => u.length <= 6) ?? [],
  );

  const scored = candidates.map((song) => {
    let score = 0;
    if (preferredArtists.has(song.artist)) score += 3;
    if (song.coverUrl && song.coverUrl !== MUSIC_COVER_PLACEHOLDER) score += 1;
    if (song.album) score += 1;
    return { song, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const picked: MusicMemoryRecommendation[] = [];
  const usedArtists = new Set<string>();

  for (const { song } of scored) {
    if (picked.length >= FINAL_COUNT) break;
    if (usedArtists.has(song.artist)) continue;

    picked.push(toRecommendation(song, context, primaryType, picked.length));
    usedArtists.add(song.artist);
  }

  return picked;
}

function toRecommendation(
  song: DynamicSong,
  context: NormalizedMusicContext,
  spaceMemoryType: SpaceMemoryType,
  index: number,
): MusicMemoryRecommendation {
  const matchedSignals = [
    spaceMemoryType,
    ...context.emotionalTone.slice(0, 2),
  ].slice(0, 5);

  const reasons = [
    `${song.title}的质感很贴近画面里的氛围。`,
    `${song.artist}的声音适合这段空间的情绪。`,
    `这首歌的呼吸感和画面的节奏很合拍。`,
    `像为这段记忆配的背景音乐。`,
  ];

  return {
    song: {
      id: `dynamic-${song.songId}`,
      title: song.title,
      artist: song.artist,
      neteaseKeyword: `${song.title} ${song.artist.split(" / ")[0]}`,
      songId: song.songId,
      neteaseSongId: song.songId,
      coverUrl: song.coverUrl,
      songUrl: song.songUrl,
      album: song.album,
      emotions: context.emotionalTone.slice(0, 4),
      memoryTypes: [spaceMemoryType],
      scenes: [],
      visibleObjects: [],
      timeFeelings: [],
      colorFeelings: [],
      culturalSignals: [],
      avoidWhen: [],
      season: "all" as const,
      pace: "medium" as const,
      lightTone: "neutral" as const,
      narrative: "",
      archetype: "unknown_soft_memory" as const,
      description: "",
    } satisfies MusicSong,
    score: 10,
    reason: reasons[index % reasons.length],
    matchedSignals,
    spaceMemoryType,
  };
}

async function qwenCurate(
  candidates: DynamicSong[],
  context: NormalizedMusicContext,
  primaryType: SpaceMemoryType,
): Promise<MusicMemoryRecommendation[]> {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) return ruleBasedCurate(candidates, context, primaryType);

  const candidateList = candidates
    .slice(0, 12)
    .map(
      (s, i) =>
        `${i + 1}. 《${s.title}》- ${s.artist}${s.album ? ` (${s.album})` : ""}`,
    )
    .join("\n");

  const moodSummary = [
    `场景: ${context.sceneType}`,
    `情绪: ${context.emotionalTone.join(", ")}`,
    `光线: ${context.colorFeeling.join(", ")}`,
    `空间类型: ${primaryType}`,
  ].join("\n");

  const response = await fetch(
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.QWEN_TEXT_MODEL || "qwen-plus",
        messages: [
          {
            role: "system",
            content:
              "你是 HearSpace 音乐策展人。根据空间记忆和情绪，从候选歌曲中挑选最合适的3首。只输出 JSON，不要 markdown。",
          },
          {
            role: "user",
            content: [
              "从以下候选中挑选3首最适合这段空间记忆的歌，为每首写一句中文推荐理由（reason）。",
              "优先选择与场景情绪匹配、有空间感的歌曲。",
              "",
              "空间记忆：",
              moodSummary,
              "",
              "候选歌曲：",
              candidateList,
              "",
              '输出 JSON: { "picks": [{ "index": 1, "reason": "..." }] }',
            ].join("\n"),
          },
        ],
        temperature: 0.5,
      }),
    },
  );

  if (!response.ok) throw new Error("Qwen curator request failed");

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty Qwen response");

  const jsonText = extractJson(content);
  const parsed = JSON.parse(jsonText) as {
    picks?: Array<{ index: number; reason?: string }>;
  };

  return (parsed.picks ?? [])
    .filter((p) => p.index >= 1 && p.index <= candidates.length)
    .slice(0, FINAL_COUNT)
    .map((p, i) => {
      const song = candidates[p.index - 1];
      return {
        ...toRecommendation(song, context, primaryType, i),
        reason: p.reason || toRecommendation(song, context, primaryType, i).reason,
      };
    });
}

function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match?.[1]) return match[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  return start >= 0 && end > start ? text.slice(start, end + 1) : text;
}
