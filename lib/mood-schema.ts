export type MoodDebugSource =
  | "qwen"
  | "qwen_normalized"
  | "mock_no_key"
  | "mock_api_error";

export type SceneObservation = {
  primary_scene: string;
  visible_objects: string[];
  human_activity: string;
  lighting: string;
  color_tone: string;
  camera_style: string;
  atmosphere_evidence: string[];
};

/**
 * Legacy MusicRecommendation type from Qwen.
 * These are mood-level descriptions, NOT verified songs.
 * They MUST NOT be rendered as verified music recommendations.
 */
export type MusicRecommendation = {
  title: string;
  artist?: string;
  reason: string;
  mood: string;
};

/**
 * Tags that must NEVER appear as song titles.
 * These are atmosphere/vibe descriptors, not music identifiers.
 */
const FORBIDDEN_SONG_TITLES = new Set([
  "春日", "花园", "胶片感", "治愈", "孤独", "黄昏", "柔和",
  "城市夜晚", "温柔", "安静", "华语", "独立音乐", "民谣",
  "青春", "回忆", "电影感", "水边", "深夜", "轻音乐",
  "午后", "雨天", "夏天", "秋天", "冬天", "春天",
  "慢歌", "轻民谣", "钢琴曲", "古风", "国风",
]);

/**
 * Runtime guard: determines whether a value is a verified music recommendation
 * with all required fields for display as a real song.
 *
 * Only objects with ALL of: title, artist, songId, songUrl, metadataVerified=true
 * can pass this guard.
 *
 * Keywords/tags like "春日", "花园", "胶片感" will always fail.
 */
export function isVerifiedMusicRecommendation(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;

  // Must have a song object or be the song itself
  const song = (candidate.song as Record<string, unknown>) ?? candidate;

  if (!song || typeof song !== "object") return false;

  const title = typeof song.title === "string" ? song.title.trim() : "";
  const artist = typeof song.artist === "string" ? song.artist.trim() : "";
  const songId = song.songId ?? song.neteaseSongId;
  const songUrl = typeof song.songUrl === "string" ? song.songUrl : "";
  const metadataVerified = song.metadataVerified === true;

  // Hard requirement: all five fields must be present
  if (!title || !artist || !songId || !songUrl || !metadataVerified) {
    return false;
  }

  // Forbidden titles check: keywords/tags can NEVER be song names
  if (FORBIDDEN_SONG_TITLES.has(title)) {
    return false;
  }

  // Song titles must contain CJK or Latin characters (not pure emoji/symbols)
  if (!/[一-鿿\w]/.test(title)) {
    return false;
  }

  // Song URL must contain the song ID for verification
  if (!songUrl.includes(String(songId))) {
    return false;
  }

  return true;
}

/**
 * Tag words that must NEVER appear in a music recommendation display.
 * These are strictly atmosphere/vibe descriptors.
 */
export const FORBIDDEN_TAG_WORDS = [
  "春日", "花园", "胶片感", "治愈", "孤独", "黄昏", "柔和",
  "城市夜晚", "温柔", "安静", "华语", "独立音乐", "民谣",
  "青春", "回忆", "电影感", "水边", "深夜", "轻音乐",
  "午后", "雨天", "夏天", "秋天", "冬天", "春天",
  "慢歌", "轻民谣", "钢琴曲", "古风", "国风",
] as const;

export type MoodResult = {
  scene_observation: SceneObservation;
  spaceTags?: string[];
  sceneTags?: string[];
  emotionTags?: string[];
  memoryTags?: string[];
  visualTags?: string[];
  seasonTags?: string[];
  mood_title: string;
  mood_subtitle: string;
  time_label: string;
  writing: string;
  space_memory_text: string;
  space_personality: string;
  visual_tone: string[];
  music_query: string;
  music_keywords: string[];
  /** @deprecated Use MusicMemoryRecommendation[] from music-library instead. Always empty from Qwen. */
  music_memories: MusicRecommendation[];
  /** @deprecated Use MusicMemoryRecommendation[] from music-library instead. Always empty from Qwen. */
  music_recommendations?: MusicRecommendation[];
  share_card_text: string;
  visual_mood_tags: string[];
  debug_source: MoodDebugSource;
};

export function isMoodResult(value: unknown): value is MoodResult {
  const candidate = value as Partial<MoodResult>;
  return isMoodResultCore(value) && isMoodDebugSource(candidate.debug_source);
}

export function isMoodResultCore(
  value: unknown,
): value is Omit<MoodResult, "debug_source"> {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<MoodResult>;
  const sceneObservation = candidate.scene_observation;

  return (
    Boolean(sceneObservation) &&
    typeof sceneObservation === "object" &&
    typeof sceneObservation.primary_scene === "string" &&
    Array.isArray(sceneObservation.visible_objects) &&
    sceneObservation.visible_objects.every(
      (object) => typeof object === "string",
    ) &&
    typeof sceneObservation.human_activity === "string" &&
    typeof sceneObservation.lighting === "string" &&
    typeof sceneObservation.color_tone === "string" &&
    typeof sceneObservation.camera_style === "string" &&
    Array.isArray(sceneObservation.atmosphere_evidence) &&
    sceneObservation.atmosphere_evidence.every(
      (evidence) => typeof evidence === "string",
    ) &&
    isOptionalStringArray(candidate.spaceTags) &&
    isOptionalStringArray(candidate.sceneTags) &&
    isOptionalStringArray(candidate.emotionTags) &&
    isOptionalStringArray(candidate.memoryTags) &&
    isOptionalStringArray(candidate.visualTags) &&
    isOptionalStringArray(candidate.seasonTags) &&
    typeof candidate.mood_title === "string" &&
    typeof candidate.mood_subtitle === "string" &&
    typeof candidate.time_label === "string" &&
    typeof candidate.writing === "string" &&
    typeof candidate.space_memory_text === "string" &&
    typeof candidate.space_personality === "string" &&
    Array.isArray(candidate.visual_tone) &&
    candidate.visual_tone.every((tone) => typeof tone === "string") &&
    typeof candidate.music_query === "string" &&
    Array.isArray(candidate.music_keywords) &&
    candidate.music_keywords.every((keyword) => typeof keyword === "string") &&
    Array.isArray(candidate.music_memories) &&
    candidate.music_memories.every(isMusicRecommendation) &&
    (
      candidate.music_recommendations === undefined ||
      (
        Array.isArray(candidate.music_recommendations) &&
        candidate.music_recommendations.every(isMusicRecommendation)
      )
    ) &&
    typeof candidate.share_card_text === "string" &&
    Array.isArray(candidate.visual_mood_tags) &&
    candidate.visual_mood_tags.every((tag) => typeof tag === "string")
  );
}

function isOptionalStringArray(value: unknown) {
  return (
    value === undefined ||
    (Array.isArray(value) && value.every((item) => typeof item === "string"))
  );
}

function isMusicRecommendation(value: unknown): value is MusicRecommendation {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<MusicRecommendation>;

  return (
    typeof candidate.title === "string" &&
    (
      candidate.artist === undefined ||
      typeof candidate.artist === "string"
    ) &&
    typeof candidate.reason === "string" &&
    typeof candidate.mood === "string"
  );
}

export function isMoodDebugSource(value: unknown): value is MoodDebugSource {
  return (
    value === "qwen" ||
    value === "qwen_normalized" ||
    value === "mock_no_key" ||
    value === "mock_api_error"
  );
}
