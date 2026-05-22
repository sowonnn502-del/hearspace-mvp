import { musicMemoryLibrary, type MusicMemoryLibraryItem } from "@/lib/music-memory-library";
import type { MoodResult, MusicRecommendation } from "@/lib/mood-schema";

export type MusicMemoryMatch = MusicRecommendation & {
  source?: string;
  scene_tags: string[];
  keywords: string[];
};

const GENERIC_TITLES = new Set([
  "soft piano",
  "slow ambient",
  "tape warmth",
  "ambient",
  "piano",
  "lofi",
  "lo-fi",
  "music",
  "ost",
]);

const GENERIC_REASON_PATTERNS = [
  "suits the",
  "适合这个空间",
  "相得益彰",
  "氛围",
  "mood",
  "feeling",
];

export function getMusicMemoryRecommendations(
  result: MoodResult,
): MusicMemoryMatch[] {
  const qwenRecommendations = normalizeQwenRecommendations(
    result.music_recommendations,
  );

  if (qwenRecommendations.length >= 3) {
    return qwenRecommendations.slice(0, 3);
  }

  const libraryMatches = matchMusicMemories(result).filter(
    (match) =>
      !qwenRecommendations.some(
        (qwen) => normalizeText(qwen.title) === normalizeText(match.title),
      ),
  );

  return [...qwenRecommendations, ...libraryMatches].slice(0, 3);
}

export function matchMusicMemories(result: MoodResult): MusicMemoryMatch[] {
  const query = buildQueryTokens(result);

  return musicMemoryLibrary
    .map((item, index) => ({
      item,
      index,
      score: scoreLibraryItem(item, query),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map(({ item }) => toMusicMemoryMatch(item));
}

function normalizeQwenRecommendations(
  recommendations: MusicRecommendation[] | undefined,
): MusicMemoryMatch[] {
  if (!recommendations || recommendations.length === 0) return [];

  return recommendations
    .filter((recommendation) => !isGenericRecommendation(recommendation))
    .map((recommendation) => ({
      ...recommendation,
      scene_tags: [recommendation.mood],
      keywords: [recommendation.mood, recommendation.title],
    }));
}

function isGenericRecommendation(recommendation: MusicRecommendation) {
  const title = normalizeText(recommendation.title);
  const reason = normalizeText(recommendation.reason);

  if (GENERIC_TITLES.has(title)) return true;
  if (recommendation.reason.trim().length < 18) return true;

  return GENERIC_REASON_PATTERNS.some((pattern) => reason.includes(pattern));
}

function buildQueryTokens(result: MoodResult) {
  const scene = result.scene_observation;

  return [
    result.mood_title,
    result.time_label,
    result.writing,
    result.space_personality,
    scene.primary_scene,
    scene.human_activity,
    scene.lighting,
    scene.color_tone,
    scene.camera_style,
    ...scene.visible_objects,
    ...scene.atmosphere_evidence,
    ...result.music_keywords,
    ...result.visual_mood_tags,
  ].flatMap(tokenize);
}

function scoreLibraryItem(item: MusicMemoryLibraryItem, query: string[]) {
  const haystack = [
    item.title,
    item.artist,
    item.source,
    item.reason,
    ...item.moods,
    ...item.scenes,
    ...item.time_feelings,
    ...item.keywords,
  ].flatMap((value) => tokenize(value ?? ""));

  let score = 0;

  for (const queryToken of query) {
    for (const itemToken of haystack) {
      if (queryToken === itemToken) score += 4;
      else if (queryToken.includes(itemToken) || itemToken.includes(queryToken)) {
        score += 1.8;
      }
    }
  }

  score += semanticBoost(item, query);

  return score;
}

function semanticBoost(item: MusicMemoryLibraryItem, query: string[]) {
  const text = query.join(" ");
  let score = 0;

  const boosts: Array<[RegExp, string[], number]> = [
    [/教室|校园|毕业|class|classroom|chalk|desk/, ["校园毕业感", "华语青春OST"], 8],
    [/雨|rain|wet|街|street|neon|霓虹/, ["雨夜城市感", "东方氛围电子"], 8],
    [/餐桌|晚餐|厨房|table|dinner/, ["餐桌胶片感"], 8],
    [/庭院|天井|花园|春|courtyard|garden|flower/, ["春日庭院感", "江南民谣感"], 8],
    [/江南|水|月|古琴|笛|国风/, ["国风ambient", "江南民谣感"], 8],
    [/夜|深夜|moon|midnight/, ["夜晚", "深夜", "city pop"], 5],
    [/青春|young|youth|kpop|idol/, ["kpop", "华语青春OST"], 5],
  ];

  for (const [pattern, keywords, value] of boosts) {
    if (!pattern.test(text)) continue;
    if (keywords.some((keyword) => item.keywords.includes(keyword))) {
      score += value;
    }
  }

  return score;
}

function toMusicMemoryMatch(item: MusicMemoryLibraryItem): MusicMemoryMatch {
  return {
    title: item.title,
    artist: item.artist,
    source: item.source,
    mood: item.moods.slice(0, 2).join(" / "),
    reason: item.reason,
    scene_tags: item.scenes.slice(0, 4),
    keywords: item.keywords.slice(0, 5),
  };
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(/[\s,，.。/、:：;；|·]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}
