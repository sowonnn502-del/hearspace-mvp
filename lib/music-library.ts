import type { MoodResult } from "@/lib/mood-schema";
import { generatedMusicLibrary } from "@/lib/music-library.generated";
import type {
  MusicArchetype,
  MusicLightTone,
  MusicPace,
  MusicSeason,
} from "@/lib/music-taxonomy";
import { type SpaceMemoryType } from "@/lib/space-memory-taxonomy";
import {
  extractVisualGrounding,
  tokenize,
  uniqueStrings,
  type NormalizedMusicContext,
} from "@/lib/visual-grounding";
import { routeSpaceMemoryType } from "@/lib/space-memory-router";

export type MusicSong = {
  id: string;
  title: string;
  artist: string;
  neteaseKeyword: string;
  songId?: string;
  songUrl?: string;
  neteaseSongId?: string;
  coverUrl?: string;
  album?: string;
  memoryTypes: SpaceMemoryType[];
  scenes: string[];
  visibleObjects: string[];
  emotions: string[];
  timeFeelings: string[];
  colorFeelings: string[];
  culturalSignals: string[];
  avoidWhen: string[];
  season: MusicSeason;
  pace: MusicPace;
  lightTone: MusicLightTone;
  narrative: string;
  archetype: MusicArchetype;
  description: string;
};

export type CuratedMusicTrack = MusicSong;

export type MusicMemoryRecommendation = {
  song: MusicSong;
  score: number;
  reason: string;
  matchedSignals: string[];
  spaceMemoryType: SpaceMemoryType;
};

export const MUSIC_COVER_PLACEHOLDER = "/music-cover-placeholder.jpg";
export const curatedMusicLibrary = generatedMusicLibrary;

export function matchMusicByMemory(result: MoodResult): MusicMemoryRecommendation[] {
  const context = extractVisualGrounding(result);
  const routedTypes = routeSpaceMemoryType(context);
  const semanticContext = buildSemanticContext(context, routedTypes);
  const scored = curatedMusicLibrary
    .filter((songItem) => shouldConsiderSong(songItem, routedTypes, context))
    .map((songItem, index) => ({
      ...scoreSong(songItem, context, semanticContext, routedTypes[0]),
      index,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const recommendations = scored
    .filter((item) => item.score > -4)
    .slice(0, 3)
    .map(({ index: _index, ...item }) => item);

  if (recommendations.length >= 3) return recommendations;

  return fillFallback(recommendations, routedTypes[0], semanticContext).slice(0, 3);
}

export const matchMusicByMood = matchMusicByMemory;

type SemanticContext = {
  memoryTypes: SpaceMemoryType[];
  emotions: string[];
  scenes: string[];
  season: MusicSeason;
  lightTone: MusicLightTone;
};

function buildSemanticContext(
  context: NormalizedMusicContext,
  memoryTypes: SpaceMemoryType[],
): SemanticContext {
  return {
    memoryTypes,
    emotions: uniqueStrings([...context.emotionalTone, ...context.colorFeeling]),
    scenes: uniqueStrings([context.sceneType, ...context.visibleObjects]),
    season: inferSeason(context),
    lightTone: inferLightTone(context),
  };
}

function shouldConsiderSong(
  songItem: MusicSong,
  routedTypes: SpaceMemoryType[],
  context: NormalizedMusicContext,
) {
  if (
    songItem.memoryTypes.includes("chinese_garden_water") &&
    (!context.culturalSignals.length ||
      context.forbiddenAssumptions.includes("chinese_garden_water"))
  ) {
    return false;
  }

  return songItem.memoryTypes.some((type) => routedTypes.includes(type));
}

function scoreSong(
  songItem: MusicSong,
  context: NormalizedMusicContext,
  semanticContext: SemanticContext,
  spaceMemoryType: SpaceMemoryType,
): MusicMemoryRecommendation {
  const sceneMatch = countMatches(semanticContext.scenes, songItem.scenes);
  const emotionMatch = countMatches(semanticContext.emotions, songItem.emotions);
  const memoryTypeMatch = countMatches(semanticContext.memoryTypes, songItem.memoryTypes);
  const seasonMatch =
    songItem.season === "all" || semanticContext.season === songItem.season ? 1 : 0;
  const lightToneMatch =
    songItem.lightTone === "neutral" || semanticContext.lightTone === songItem.lightTone
      ? 1
      : 0;
  const culturalSignalMatch = countMatches(context.culturalSignals, songItem.culturalSignals);
  const forbiddenMismatch = countForbiddenMismatch(context, songItem);
  const score =
    memoryTypeMatch * 5 +
    emotionMatch * 4 +
    sceneMatch * 2 +
    seasonMatch * 1.5 +
    lightToneMatch * 1.5 +
    culturalSignalMatch * 2 -
    forbiddenMismatch * 6;
  const matchedSignals = uniqueStrings([
    ...matchLabels(semanticContext.memoryTypes, songItem.memoryTypes),
    ...matchLabels(semanticContext.emotions, songItem.emotions),
    ...matchLabels(semanticContext.scenes, songItem.scenes),
    ...matchLabels([semanticContext.season], [songItem.season]),
    ...matchLabels([semanticContext.lightTone], [songItem.lightTone]),
  ]).slice(0, 5);

  return {
    song: songItem,
    score,
    reason: createReason(songItem, context, matchedSignals),
    matchedSignals,
    spaceMemoryType,
  };
}

function countForbiddenMismatch(context: NormalizedMusicContext, songItem: MusicSong) {
  const contextText = contextTokens(context).join(" ");
  let mismatch = 0;

  if (
    context.forbiddenAssumptions.length > 0 &&
    songItem.memoryTypes.includes("chinese_garden_water")
  ) {
    mismatch += 1;
  }

  if (
    songItem.memoryTypes.includes("rain_window_solitude") &&
    !/雨|雨后|窗边|暗光|路灯|夜灯|玻璃|湿润|night|rain|window|dark/.test(contextText)
  ) {
    mismatch += 1;
  }

  for (const avoidSignal of songItem.avoidWhen) {
    if (contextText.includes(avoidSignal.toLowerCase())) mismatch += 1;
  }

  return mismatch;
}

function createReason(
  songItem: MusicSong,
  context: NormalizedMusicContext,
  matchedSignals: string[],
) {
  const signals = matchedSignals.length
    ? matchedSignals.slice(0, 3).join("、")
    : context.sceneType || "这段空间";

  return `${songItem.description} 它更贴近画面里的${signals}，不是单纯按关键词凑出来的歌。`;
}

function fillFallback(
  current: MusicMemoryRecommendation[],
  type: SpaceMemoryType,
  semanticContext: SemanticContext,
) {
  const fallbackType = type === "unknown_soft_memory" ? "daily_life_home" : type;
  const existing = new Set(current.map((item) => item.song.id));
  const fallbackSongs = curatedMusicLibrary
    .filter((songItem) => songItem.memoryTypes.includes(fallbackType) && !existing.has(songItem.id))
    .slice(0, 3 - current.length)
    .map((songItem) => ({
      song: songItem,
      score: 0,
      reason: songItem.description,
      matchedSignals: uniqueStrings([
        ...songItem.memoryTypes,
        ...songItem.emotions,
        semanticContext.season,
      ]).slice(0, 3),
      spaceMemoryType: fallbackType,
    }));

  if (fallbackSongs.length) return [...current, ...fallbackSongs];

  return [
    ...current,
    ...curatedMusicLibrary
      .filter((songItem) => !songItem.memoryTypes.includes("chinese_garden_water"))
      .slice(0, 3 - current.length)
      .map((songItem) => ({
        song: songItem,
        score: 0,
        reason: songItem.description,
        matchedSignals: songItem.emotions.slice(0, 2),
        spaceMemoryType: "unknown_soft_memory" as SpaceMemoryType,
      })),
  ];
}

function inferSeason(context: NormalizedMusicContext): MusicSeason {
  const text = contextTokens(context).join(" ");

  if (/春|花|spring/.test(text)) return "spring";
  if (/夏|海|阳光|summer/.test(text)) return "summer";
  if (/冬|冷|winter/.test(text)) return "winter";
  if (/秋|autumn|fall/.test(text)) return "autumn";

  return "all";
}

function inferLightTone(context: NormalizedMusicContext): MusicLightTone {
  const text = contextTokens(context).join(" ");

  if (/暗|深夜|夜晚|蓝黑|dark|night/.test(text)) return "dark";
  if (/暖|灯|黄|warm/.test(text)) return "warm";
  if (/冷|灰蓝|雨|cool/.test(text)) return "cool";
  if (/明亮|阳光|bright/.test(text)) return "bright";
  if (/柔光|soft/.test(text)) return "soft";

  return "neutral";
}

function contextTokens(context: NormalizedMusicContext) {
  return uniqueStrings([
    context.sceneType,
    context.activity,
    ...context.visibleObjects,
    ...context.timeFeeling,
    ...context.colorFeeling,
    ...context.emotionalTone,
    ...context.culturalSignals,
  ]).flatMap(tokenize);
}

function countMatches(source: string[], target: string[]) {
  return matchLabels(source, target).length;
}

function matchLabels(source: string[], target: string[]) {
  const targetTokens = target.flatMap(tokenize);
  return source.filter((label) =>
    tokenize(label).some((sourceToken) =>
      targetTokens.some((targetToken) => fuzzyMatch(sourceToken, targetToken)),
    ),
  );
}

function fuzzyMatch(a: string, b: string) {
  return a === b || a.includes(b) || b.includes(a);
}

export function getNeteaseUrl(songItem: MusicSong) {
  if (songItem.songUrl) return songItem.songUrl;

  const songId = songItem.songId || songItem.neteaseSongId;

  if (songId) return `https://music.163.com/#/song?id=${songId}`;

  return `https://music.163.com/#/search/m/?s=${encodeURIComponent(songItem.neteaseKeyword)}&type=1`;
}
