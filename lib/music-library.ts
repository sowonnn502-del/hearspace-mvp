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
  metadataSource: "netease" | "manual";
  metadataVerified: boolean;
  metadataCheckedAt?: string;
  unavailableReason?: string;
  spaceTags: SpaceTag[];
  sceneTags: SceneTag[];
  cityTags: string[];
  timeTags: string[];
  socialContextTags: string[];
  musicSceneTags: string[];
  cultureTags: string[];
  emotionTags: EmotionTag[];
  memoryTags: MemoryTag[];
  visualTags: VisualTag[];
  seasonTags: SeasonTag[];
  atmosphereTags: AtmosphereTag[];
  similarSpaces: SceneTag[];
  musicFeatures: string[];
  lyricalThemes: string[];
  usageScenes: string[];
  recommendationEvidence: {
    space: string[];
    scene: string[];
    music: string[];
  };
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
  matchedEvidence?: {
    space: string[];
    scene: string[];
    music: string[];
  };
  matchedTagBreakdown?: Record<string, number>;
  spaceMemoryType: SpaceMemoryType;
  coverageRisk: boolean;
  candidateCount: number;
};

export const MUSIC_COVER_PLACEHOLDER = "/music-cover-placeholder.jpg";
export const curatedMusicLibrary = generatedMusicLibrary;
export const verifiedMusicLibrary = generatedMusicLibrary.filter(isVerifiedMusicSong);

export function getEmbeddedMusicRecommendations(
  result: MoodResult,
): MusicMemoryRecommendation[] {
  void result;
  return [];
}

export function matchMusicByMemory(result: MoodResult): MusicMemoryRecommendation[] {
  return getMusicRecommendationPool(result).slice(0, 3);
}

export function getMusicRecommendationPool(result: MoodResult): MusicMemoryRecommendation[] {
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
  const coverageRisk = candidates.length < 3 || recommendations.length < 3;
  const withCoverage = recommendations.map((recommendation) => ({
    ...recommendation,
    coverageRisk,
    candidateCount: candidates.length,
  }));

  logMusicDebug({
    context,
    sourceTags: inferMoodTaxonomyTags(contextToMoodResult(context)),
    candidates,
    selected: withCoverage,
  });

  return mergeUniqueRecommendations(withCoverage);
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
      metadataSource: "manual",
      metadataVerified: false,
      unavailableReason: "Qwen generated recommendation is not part of verified generatedMusicLibrary.",
      spaceTags: [spaceMemoryType === "campus_youth" ? "Campus Space" : "Solitude Space"],
      sceneTags: ["Window"],
      cityTags: [],
      timeTags: [],
      socialContextTags: [],
      musicSceneTags: [],
      cultureTags: [],
      emotionTags: ["Quiet"],
      memoryTags: ["Old Photo"],
      visualTags: ["Film Look"],
      seasonTags: ["All Season"],
      atmosphereTags: ["Quiet"],
      similarSpaces: ["Window"],
      musicFeatures: [],
      lyricalThemes: [],
      usageScenes: [],
      recommendationEvidence: {
        space: [],
        scene: [],
        music: [],
      },
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

  const matchedEvidence = {
    space: context.visibleObjects.slice(0, 2),
    scene: [context.sceneType, spaceMemoryType].filter(Boolean),
    music: song.musicFeatures.slice(0, 2),
  };

  return {
    song,
    score: 20 - index,
    reason: createReason(song, context, matchedEvidence),
    matchedSignals: uniqueStrings([
      recommendation.mood,
      spaceMemoryType,
      ...context.emotionalTone,
    ]).slice(0, 5),
    matchedEvidence,
    spaceMemoryType,
    coverageRisk: true,
    candidateCount: 0,
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
  const allCandidates = verifiedMusicLibrary.filter((songItem) =>
    shouldConsiderSong(songItem, routedTypes, context),
  );
  const requiredMusicSceneTags = getRequiredMusicSceneTags(context);
  const musicSceneLockedCandidates = requiredMusicSceneTags.length
    ? allCandidates.filter((songItem) =>
        requiredMusicSceneTags.some((sceneTag) =>
          songItem.musicSceneTags.includes(sceneTag),
        ),
      )
    : allCandidates;

  if (requiredMusicSceneTags.length && musicSceneLockedCandidates.length === 0) {
    return [];
  }

  const requiredSceneTags = requiredMusicSceneTags.length
    ? []
    : getRequiredSceneTags(context);
  const sceneLockedCandidates = requiredSceneTags.length
    ? musicSceneLockedCandidates.filter((songItem) =>
        requiredSceneTags.some((sceneTag) => songItem.sceneTags.includes(sceneTag)),
      )
    : musicSceneLockedCandidates;

  const primaryCandidates =
    primaryType && primaryType !== "unknown_soft_memory"
      ? sceneLockedCandidates.filter((songItem) => songItem.memoryTypes.includes(primaryType))
      : [];

  return primaryCandidates.length >= 3 ? primaryCandidates : sceneLockedCandidates;
}

function getRequiredMusicSceneTags(context: NormalizedMusicContext) {
  const text = rawContextText(context);
  const rules = [
    { tag: "Late Night Convenience Store", pattern: /便利店|convenience/i },
    { tag: "Airport Waiting", pattern: /机场|候机|airport/i },
    { tag: "Train Window", pattern: /火车|高铁|列车|车窗|train/i },
    { tag: "Subway / Empty Metro", pattern: /地铁|subway|metro|空站/i },
    { tag: "Hotel Room", pattern: /酒店|旅馆|hotel/i },
    { tag: "Seaside Sunset", pattern: /海边|海|seaside|beach/i },
    { tag: "Campus Sunset", pattern: /校园|操场|放学|毕业|campus/i },
    { tag: "Rainy Window", pattern: /雨|窗边|窗户|rain|window/i },
    { tag: "Night Street Walk", pattern: /夜路|街道|街角|night street/i },
    { tag: "Park Grass / Bench", pattern: /公园|草地|长椅|park/i },
    { tag: "Bus Stop", pattern: /公交|公交站|bus stop/i },
    { tag: "Empty Station", pattern: /车站|站台|空站|station/i },
    { tag: "Office Night", pattern: /办公室|写字楼|加班|office/i },
    { tag: "Bridge / Overpass", pattern: /天桥|高架|立交桥|overpass|bridge/i },
    { tag: "Old Neighborhood", pattern: /老街|旧街|小区|old neighborhood/i },
  ];

  return rules.filter((rule) => rule.pattern.test(text)).map((rule) => rule.tag);
}

function getRequiredSceneTags(context: NormalizedMusicContext): SceneTag[] {
  const text = rawContextText(context);
  const specificRules: Array<{ tag: SceneTag; pattern: RegExp }> = [
    { tag: "Convenience Store", pattern: /便利店|convenience/ },
    { tag: "Airport Waiting", pattern: /机场|候机|airport/ },
    { tag: "Train Window", pattern: /火车|高铁|列车|车窗|train/ },
    { tag: "Subway", pattern: /地铁|subway|metro/ },
    { tag: "Hotel", pattern: /酒店|旅馆|hotel/ },
  ];
  const specificMatch = specificRules.find((rule) => rule.pattern.test(text));

  if (specificMatch) return [specificMatch.tag];

  const broadRules: Array<{ tag: SceneTag; pattern: RegExp }> = [
    { tag: "Playground", pattern: /操场|playground/ },
    { tag: "Park", pattern: /公园|草地|长椅|park/ },
    { tag: "Window", pattern: /窗边|窗户|玻璃|window/ },
    { tag: "Night Street", pattern: /街道|街角|夜路|night street/ },
    { tag: "Restaurant", pattern: /餐厅|饭店|restaurant/ },
    { tag: "Cafe", pattern: /咖啡|cafe/ },
  ];

  return broadRules
    .filter((rule) => rule.pattern.test(text))
    .map((rule) => rule.tag);
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
  const musicSceneMatches = getRequiredMusicSceneTags(context).filter((tag) =>
    songItem.musicSceneTags.includes(tag),
  );
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
    musicSceneMatches.length * 14 +
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
    ...musicSceneMatches,
    ...matchLabels([semanticContext.season], [songItem.season]),
    ...matchLabels([semanticContext.lightTone], [songItem.lightTone]),
  ]).slice(0, 5);
  const matchedEvidence = buildMatchedEvidence(songItem, context, matchedSignals);

  return {
    song: songItem,
    score,
    reason: createReason(songItem, context, matchedEvidence),
    matchedSignals,
    matchedEvidence,
    matchedTagBreakdown: weighted.breakdown,
    spaceMemoryType,
    coverageRisk: false,
    candidateCount: 0,
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
  matchedEvidence: NonNullable<MusicMemoryRecommendation["matchedEvidence"]>,
) {
  const spaceEvidence = matchedEvidence.space.join("、") || "画面里的空间线索";
  const sceneEvidence = matchedEvidence.scene.join("、") || context.sceneType || "这一类场景";
  const musicEvidence =
    matchedEvidence.music.join("、") || songItem.usageScenes.slice(0, 2).join("、") || "歌曲气质";

  return `照片里的${spaceEvidence}，让这个空间更接近${sceneEvidence}。这首歌的${musicEvidence}与这些空间记忆相连，所以不是只按情绪推荐。`;
}

function buildMatchedEvidence(
  songItem: MusicSong,
  context: NormalizedMusicContext,
  matchedSignals: string[],
): NonNullable<MusicMemoryRecommendation["matchedEvidence"]> {
  const space = uniqueStrings([
    ...context.visibleObjects.filter(hasCjkText),
    ...context.colorFeeling.filter(hasCjkText),
    ...context.timeFeeling.filter(hasCjkText),
  ]).slice(0, 3);
  const scene = uniqueStrings([
    context.sceneType,
    ...songItem.usageScenes,
    ...matchedSignals.filter(hasCjkText),
  ]).slice(0, 3);
  const music = uniqueStrings([
    ...songItem.musicFeatures,
    songItem.pace !== "medium" ? `${songItem.pace} pace` : "",
    songItem.lightTone !== "neutral" ? `${songItem.lightTone} light` : "",
  ]).filter(Boolean).slice(0, 3);

  return { space, scene, music };
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

function isVerifiedMusicSong(songItem: MusicSong) {
  const songId = songItem.songId || songItem.neteaseSongId;

  return (
    songItem.metadataVerified === true &&
    songItem.metadataSource === "netease" &&
    songItem.confidence >= 0.65 &&
    (songItem.musicSceneTags?.length ?? 0) > 0 &&
    (songItem.musicSceneTags?.length ?? 0) <= 5 &&
    Boolean(songId) &&
    Boolean(songItem.coverUrl) &&
    songItem.coverUrl !== MUSIC_COVER_PLACEHOLDER &&
    Boolean(songItem.songUrl) &&
    Boolean(songItem.songUrl?.includes(`id=${songId}`))
  );
}

function logMusicDebug({
  context,
  sourceTags,
  candidates,
  selected,
}: {
  context: NormalizedMusicContext;
  sourceTags: ReturnType<typeof inferMoodTaxonomyTags>;
  candidates: MusicSong[];
  selected: MusicMemoryRecommendation[];
}) {
  if (process.env.NODE_ENV !== "development") return;

  const excludedTracks = generatedMusicLibrary
    .filter((songItem) => !isVerifiedMusicSong(songItem))
    .map((songItem) => ({
      title: songItem.title,
      artist: songItem.artist,
      songId: songItem.songId || songItem.neteaseSongId,
      reason: songItem.unavailableReason || "metadata not verified",
    }));

  console.log("[HearSpace Music] Source: verified generatedMusicLibrary");
  console.log(`[HearSpace Music] Candidate count: ${candidates.length}`);
  for (const item of selected) {
    console.log(
      `[HearSpace Music] Selected: ${item.song.title} - ${item.song.artist} - ${
        item.song.songId || item.song.neteaseSongId || "no-song-id"
      }`,
    );
  }
  console.log("[HearSpace Music] Debug:", {
    sourceTags,
    sourceScene: context.sceneType,
    candidateCount: candidates.length,
    excludedTracks,
    selectedTracks: selected.map((item) => ({
      title: item.song.title,
      artist: item.song.artist,
      songId: item.song.songId || item.song.neteaseSongId,
      metadataVerified: item.song.metadataVerified,
    })),
    scoreBreakdown: selected.map((item) => ({
      title: item.song.title,
      score: item.score,
      breakdown: item.matchedTagBreakdown,
      matchedEvidence: item.matchedEvidence,
    })),
  });
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

function rawContextText(context: NormalizedMusicContext) {
  return uniqueStrings([
    context.sceneType,
    context.activity,
    ...context.visibleObjects,
    ...context.timeFeeling,
    ...context.colorFeeling,
    ...context.emotionalTone,
    ...context.culturalSignals,
  ]).join(" ");
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
