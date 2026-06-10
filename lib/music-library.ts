import type { MoodResult, MusicRecommendation } from "@/lib/mood-schema";
import { generatedMusicLibrary } from "@/lib/music-library.generated";
import type {
  MusicArchetype,
  MusicLightTone,
  MusicPace,
  MusicSeason,
} from "@/lib/music-taxonomy";
import { type SpaceMemoryType } from "@/lib/space-memory-taxonomy";
import {
  inferMoodTaxonomyTags,
  type AtmosphereTag,
  type EmotionTag,
  type MemoryTag,
  type SceneTag,
  type SeasonTag,
  type SpaceTag,
  type VisualTag,
} from "@/lib/taxonomy";
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
  spaceTags: SpaceTag[];
  sceneTags: SceneTag[];
  emotionTags: EmotionTag[];
  memoryTags: MemoryTag[];
  visualTags: VisualTag[];
  seasonTags: SeasonTag[];
  atmosphereTags: AtmosphereTag[];
  similarSpaces: SceneTag[];
  recommendationReason: string;
  confidence: number;
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
  matchedTagBreakdown?: Record<string, number>;
  spaceMemoryType: SpaceMemoryType;
};

export const MUSIC_COVER_PLACEHOLDER = "/music-cover-placeholder.jpg";
export const curatedMusicLibrary = generatedMusicLibrary;

export function getEmbeddedMusicRecommendations(
  result: MoodResult,
): MusicMemoryRecommendation[] {
  if (result.debug_source === "mock_no_key" || result.debug_source === "mock_api_error") {
    return [];
  }

  const embedded = result.music_recommendations?.length
    ? result.music_recommendations
    : result.music_memories;

  if (!embedded.length) return [];

  const context = extractVisualGrounding(result);
  const routedTypes = routeSpaceMemoryType(context);
  const primaryType = routedTypes[0] ?? "unknown_soft_memory";

  return embedded
    .filter((recommendation) => recommendation.title.trim())
    .slice(0, 3)
    .map((recommendation, index) =>
      toEmbeddedMusicRecommendation(recommendation, context, primaryType, index),
    );
}

export function matchMusicByMemory(result: MoodResult): MusicMemoryRecommendation[] {
  return getMusicRecommendationPool(result).slice(0, 3);
}

export function getMusicRecommendationPool(result: MoodResult): MusicMemoryRecommendation[] {
  const embeddedRecommendations = getEmbeddedMusicRecommendations(result);
  const context = extractVisualGrounding(result);
  const routedTypes = routeSpaceMemoryType(context);
  const semanticContext = buildSemanticContext(context, routedTypes);
  const candidates = getCandidateSongs(routedTypes, context);
  const scored = candidates
    .map((songItem, index) => ({
      ...scoreSong(songItem, context, semanticContext, routedTypes[0]),
      index,
      tieBreak: contextualTieBreak(songItem, context),
    }))
    .sort((a, b) => b.score - a.score || b.tieBreak - a.tieBreak || a.index - b.index);

  const recommendations = pickDiverseRecommendations(scored.filter((item) => item.score > -4));
  const fallback = fillFallback(recommendations, routedTypes[0], semanticContext);

  return mergeUniqueRecommendations([
    ...embeddedRecommendations,
    ...recommendations,
    ...fallback,
  ]);
}

export const matchMusicByMood = matchMusicByMemory;

function toEmbeddedMusicRecommendation(
  recommendation: MusicRecommendation,
  context: NormalizedMusicContext,
  spaceMemoryType: SpaceMemoryType,
  index: number,
): MusicMemoryRecommendation {
  const title = recommendation.title.trim();
  const artist = recommendation.artist?.trim() ?? "";
  const librarySong = findLibrarySong(title, artist);
  const song: MusicSong =
    librarySong ??
    ({
      id: `embedded-${slugify([title, artist].filter(Boolean).join("-") || String(index))}`,
      title,
      artist,
      neteaseKeyword: [title, artist].filter(Boolean).join(" "),
      coverUrl: MUSIC_COVER_PLACEHOLDER,
      spaceTags: [spaceMemoryType === "campus_youth" ? "Campus Space" : "Solitude Space"],
      sceneTags: ["Window"],
      emotionTags: ["Quiet"],
      memoryTags: ["Old Photo"],
      visualTags: ["Film Look"],
      seasonTags: ["All Season"],
      atmosphereTags: ["Quiet"],
      similarSpaces: ["Window"],
      recommendationReason: recommendation.reason,
      confidence: 0.68,
      memoryTypes: [spaceMemoryType],
      scenes: [],
      visibleObjects: [],
      emotions: uniqueStrings([
        recommendation.mood,
        ...context.emotionalTone.slice(0, 3),
      ]),
      timeFeelings: context.timeFeeling,
      colorFeelings: context.colorFeeling,
      culturalSignals: context.culturalSignals,
      avoidWhen: [],
      season: "all",
      pace: "medium",
      lightTone: "neutral",
      narrative: "",
      archetype: "unknown_soft_memory",
      description: recommendation.reason,
    } satisfies MusicSong);

  return {
    song,
    score: 20 - index,
    reason: createReason(song, context, [
      recommendation.mood,
      ...context.colorFeeling,
      ...context.timeFeeling,
    ]),
    matchedSignals: uniqueStrings([
      recommendation.mood,
      spaceMemoryType,
      ...context.emotionalTone,
    ]).slice(0, 5),
    spaceMemoryType,
  };
}

function findLibrarySong(title: string, artist: string) {
  const normalizedTitle = normalizeForSongLookup(title);
  const normalizedArtist = normalizeForSongLookup(artist);

  return curatedMusicLibrary.find((song) => {
    if (normalizeForSongLookup(song.title) !== normalizedTitle) return false;
    if (!normalizedArtist) return true;
    return normalizeForSongLookup(song.artist).includes(normalizedArtist);
  });
}

function normalizeForSongLookup(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function getCandidateSongs(
  routedTypes: SpaceMemoryType[],
  context: NormalizedMusicContext,
) {
  const primaryType = routedTypes[0];
  const allCandidates = curatedMusicLibrary.filter((songItem) =>
    shouldConsiderSong(songItem, routedTypes, context),
  );
  const primaryCandidates =
    primaryType && primaryType !== "unknown_soft_memory"
      ? allCandidates.filter((songItem) => songItem.memoryTypes.includes(primaryType))
      : [];

  return primaryCandidates.length >= 3 ? primaryCandidates : allCandidates;
}

function scoreSong(
  songItem: MusicSong,
  context: NormalizedMusicContext,
  semanticContext: SemanticContext,
  spaceMemoryType: SpaceMemoryType,
): MusicMemoryRecommendation {
  const moodTags = inferMoodTaxonomyTags(contextToMoodResult(context));
  const weighted = scoreWeightedTaxonomy(songItem, moodTags);
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
    weighted.score +
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
    matchedTagBreakdown: weighted.breakdown,
    spaceMemoryType,
  };
}

function scoreWeightedTaxonomy(
  songItem: MusicSong,
  moodTags: ReturnType<typeof inferMoodTaxonomyTags>,
) {
  const breakdown = {
    spaceTags: countExactMatches(moodTags.spaceTags, songItem.spaceTags) * 12,
    sceneTags: countExactMatches(moodTags.sceneTags, songItem.sceneTags) * 9,
    emotionTags: countExactMatches(moodTags.emotionTags, songItem.emotionTags) * 7,
    memoryTags: countExactMatches(moodTags.memoryTags, songItem.memoryTags) * 5,
    visualTags: countExactMatches(moodTags.visualTags, songItem.visualTags) * 3,
  };
  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return { score, breakdown };
}

function countExactMatches(source: readonly string[], target: readonly string[]) {
  const targetSet = new Set(target);
  return source.filter((tag) => targetSet.has(tag)).length;
}

function contextToMoodResult(context: NormalizedMusicContext) {
  return {
    scene_observation: {
      primary_scene: context.sceneType,
      visible_objects: context.visibleObjects,
      human_activity: context.activity,
      lighting: context.timeFeeling.join(" "),
      color_tone: context.colorFeeling.join(" "),
      camera_style: "",
      atmosphere_evidence: context.visibleObjects,
    },
    mood_title: context.emotionalTone[0] ?? "",
    mood_subtitle: context.emotionalTone.join(" "),
    time_label: context.timeFeeling.join(" "),
    writing: context.emotionalTone.join(" "),
    space_memory_text: context.emotionalTone.join(" "),
    space_personality: context.activity,
    visual_tone: context.colorFeeling,
    music_query: context.emotionalTone.join(" "),
    music_keywords: context.emotionalTone,
    music_memories: [],
    music_recommendations: [],
    share_card_text: context.emotionalTone.join(" "),
    visual_mood_tags: context.emotionalTone,
    debug_source: "mock_no_key" as const,
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
  const visualSignals = uniqueStrings([
    ...context.colorFeeling,
    ...context.timeFeeling,
    ...context.visibleObjects.filter(hasCjkText),
    ...matchedSignals.filter(hasCjkText),
  ]).slice(0, 2);
  const visualPhrase = visualSignals.length
    ? visualSignals.join("与")
    : "这段空间的光线和气息";
  const emotion = pickEmotionPhrase(songItem, context);

  return `这首歌贴着${visualPhrase}慢慢展开，带着一点${emotion}，适合把这一刻再放久一点。`;
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

type ScoredMusicRecommendation = MusicMemoryRecommendation & {
  index: number;
  tieBreak: number;
};

function pickDiverseRecommendations(scored: ScoredMusicRecommendation[]) {
  const selected: ScoredMusicRecommendation[] = [];
  const selectedIds = new Set<string>();
  const selectedArtists = new Set<string>();

  for (const item of scored) {
    if (selectedIds.has(item.song.id)) continue;
    if (selectedArtists.has(item.song.artist) && selected.length < 2) continue;

    selected.push(item);
    selectedIds.add(item.song.id);
    selectedArtists.add(item.song.artist);

    if (selected.length === 3) break;
  }

  for (const item of scored) {
    if (selected.length === 3) break;
    if (selectedIds.has(item.song.id)) continue;

    selected.push(item);
    selectedIds.add(item.song.id);
  }

  return selected.map(({ index: _index, tieBreak: _tieBreak, ...item }) => item);
}

function mergeUniqueRecommendations(recommendations: MusicMemoryRecommendation[]) {
  const merged: MusicMemoryRecommendation[] = [];
  const seen = new Set<string>();

  for (const recommendation of recommendations) {
    const key = getSongIdentity(recommendation.song);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(recommendation);
  }

  return merged;
}

function getSongIdentity(songItem: MusicSong) {
  return [
    songItem.songId || songItem.neteaseSongId || songItem.id,
    normalizeForSongLookup(songItem.title),
    normalizeForSongLookup(songItem.artist),
  ]
    .filter(Boolean)
    .join(":");
}

function hasCjkText(value: string) {
  return /[\u4e00-\u9fff]/.test(value);
}

function pickEmotionPhrase(songItem: MusicSong, context: NormalizedMusicContext) {
  const candidates = uniqueStrings([
    ...songItem.emotions.filter(hasCjkText),
    ...context.emotionalTone.filter(hasCjkText),
  ]);
  const primary = candidates[0];

  if (primary) return `${primary}、慢下来并沉浸当下`;
  if (songItem.pace === "slow") return "慢下来、停在原地";
  if (songItem.pace === "upbeat") return "明亮、轻盈";

  return "贴近当下、可以继续停留";
}

function contextualTieBreak(songItem: MusicSong, context: NormalizedMusicContext) {
  const signature = contextTokens(context).join("|") || "hearspace";
  const value = `${signature}:${songItem.id}:${songItem.title}:${songItem.artist}`;
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return (hash % 1000) / 1000;
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
