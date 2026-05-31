import type { MoodResult } from "@/lib/mood-schema";
import { CULTURAL_SIGNAL_TRIGGERS } from "@/lib/space-memory-taxonomy";

export type NormalizedMusicContext = {
  sceneType: string;
  visibleObjects: string[];
  timeFeeling: string[];
  colorFeeling: string[];
  activity: string;
  emotionalTone: string[];
  culturalSignals: string[];
  forbiddenAssumptions: string[];
};

const TIME_SIGNALS = [
  "清晨",
  "上午",
  "午后",
  "傍晚",
  "黄昏",
  "夜晚",
  "深夜",
  "雨天",
  "雨后",
  "春天",
  "夏天",
  "冬日",
  "morning",
  "afternoon",
  "evening",
  "night",
  "rain",
];

const COLOR_SIGNALS = [
  "暖色",
  "冷色",
  "灰蓝",
  "蓝黑",
  "粉色",
  "绿色",
  "明亮",
  "低饱和",
  "暗色",
  "红色",
  "黄色",
  "柔光",
  "warm",
  "cool",
  "pink",
  "green",
  "dark",
];

const NIGHT_RAIN_WINDOW_SIGNALS = [
  "夜晚",
  "深夜",
  "雨",
  "雨后",
  "窗边",
  "暗光",
  "路灯",
  "夜灯",
  "玻璃",
  "湿润",
  "night",
  "rain",
  "window",
  "dark",
];

const GARDEN_PORTRAIT_SIGNALS = [
  "花园",
  "玫瑰",
  "花瓣",
  "粉色",
  "柔光",
  "裙子",
  "写真",
  "人像",
  "少女感",
  "spring",
  "flower",
  "portrait",
  "pink",
];

export function extractVisualGrounding(result: MoodResult): NormalizedMusicContext {
  const scene = result.scene_observation;

  // Guard against incomplete result data (e.g. mock results or partial API responses).
  if (!scene) {
    return {
      sceneType: "",
      visibleObjects: [],
      timeFeeling: [],
      colorFeeling: [],
      activity: "",
      emotionalTone: uniqueStrings([
        ...(result.visual_tone ?? []),
        ...(result.visual_mood_tags ?? []),
        ...(result.music_keywords ?? []),
        result.music_query,
      ]),
      culturalSignals: [],
      forbiddenAssumptions: [],
    };
  }

  const factualEvidence = uniqueStrings([
    scene.primary_scene,
    scene.human_activity,
    scene.lighting,
    scene.color_tone,
    scene.camera_style,
    ...(scene.visible_objects ?? []),
    ...(scene.atmosphere_evidence ?? []),
  ]);
  const editorialHints = uniqueStrings([
    result.mood_title,
    result.time_label,
    result.writing,
    result.space_memory_text,
    result.mood_subtitle,
    result.space_personality,
    result.music_query,
    ...result.visual_tone,
    ...result.visual_mood_tags,
    ...result.music_keywords,
  ]);
  const factualText = factualEvidence.join(" ").toLowerCase();
  const allText = uniqueStrings([...factualEvidence, ...editorialHints])
    .join(" ")
    .toLowerCase();
  const culturalSignals = CULTURAL_SIGNAL_TRIGGERS.filter((term) =>
    factualText.includes(term.toLowerCase()),
  );
  const hasNightRainWindowSignal = includesAny(factualText, NIGHT_RAIN_WINDOW_SIGNALS);
  const hasGardenPortraitSignal = includesAny(factualText, GARDEN_PORTRAIT_SIGNALS);

  return {
    sceneType: scene.primary_scene,
    visibleObjects: uniqueStrings([...scene.visible_objects, ...scene.atmosphere_evidence]),
    timeFeeling: extractSignals(allText, TIME_SIGNALS),
    colorFeeling: extractSignals(allText, COLOR_SIGNALS),
    activity: scene.human_activity,
    emotionalTone: uniqueStrings([
      ...result.visual_tone,
      ...result.visual_mood_tags,
      ...result.music_keywords,
      result.music_query,
    ]),
    culturalSignals,
    forbiddenAssumptions: uniqueStrings([
      ...(culturalSignals.length > 0 ? [] : ["江南", "古风", "国风", "东方庭院", "中式园林"]),
      ...(hasNightRainWindowSignal ? [] : ["雨夜", "深夜", "孤独"]),
      ...(hasGardenPortraitSignal && culturalSignals.length === 0 ? ["chinese_garden_water"] : []),
    ]),
  };
}

export function uniqueStrings(values: Array<string | undefined>) {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

export function tokenize(value: string) {
  const normalized = value.toLowerCase();
  const wordTokens = normalized
    .split(/[\s,，.。/、:：;；|·()（）[\]{}"'!?！?_-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
  const cjkTokens = Array.from(normalized.matchAll(/[\u4e00-\u9fff]{2,}/g)).map(
    ([token]) => token,
  );

  return Array.from(new Set([...wordTokens, ...cjkTokens]));
}

function extractSignals(text: string, signals: string[]) {
  return signals.filter((signal) => text.includes(signal.toLowerCase()));
}

function includesAny(text: string, signals: string[]) {
  return signals.some((signal) => text.includes(signal.toLowerCase()));
}
