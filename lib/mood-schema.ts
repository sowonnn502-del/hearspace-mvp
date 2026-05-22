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

export type MusicRecommendation = {
  title: string;
  artist?: string;
  reason: string;
  mood: string;
};

export type MoodResult = {
  scene_observation: SceneObservation;
  mood_title: string;
  time_label: string;
  writing: string;
  space_personality: string;
  music_keywords: string[];
  music_recommendations?: MusicRecommendation[];
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
    typeof candidate.mood_title === "string" &&
    typeof candidate.time_label === "string" &&
    typeof candidate.writing === "string" &&
    typeof candidate.space_personality === "string" &&
    Array.isArray(candidate.music_keywords) &&
    candidate.music_keywords.every((keyword) => typeof keyword === "string") &&
    (
      candidate.music_recommendations === undefined ||
      (
        Array.isArray(candidate.music_recommendations) &&
        candidate.music_recommendations.every(isMusicRecommendation)
      )
    ) &&
    Array.isArray(candidate.visual_mood_tags) &&
    candidate.visual_mood_tags.every((tag) => typeof tag === "string")
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
