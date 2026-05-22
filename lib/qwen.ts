import { HEARSPACE_SYSTEM_PROMPT, HEARSPACE_USER_PROMPT } from "@/lib/prompts";
import {
  isMoodResultCore,
  type MoodDebugSource,
  type MoodResult,
  type MusicRecommendation,
} from "@/lib/mood-schema";

type MoodResultCore = Omit<MoodResult, "debug_source">;
type ParsedMoodResult = {
  moodCore: MoodResultCore;
  debugSource: Extract<MoodDebugSource, "qwen" | "qwen_normalized">;
};

type GenerateMoodWithQwenParams = {
  image: File;
};

type DashScopeMessageContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: `data:${string};base64,${string}` } };

const DASH_SCOPE_COMPATIBLE_URL =
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const DEFAULT_QWEN_VL_MODEL = "qwen-vl-plus-latest";

export class QwenMoodError extends Error {
  constructor(
    message: string,
    public readonly code: "api_error" | "invalid_schema",
  ) {
    super(message);
    this.name = "QwenMoodError";
  }
}

export function getQwenVlModel() {
  return process.env.QWEN_VL_MODEL ?? DEFAULT_QWEN_VL_MODEL;
}

export async function generateMoodWithQwen({
  image,
}: GenerateMoodWithQwenParams): Promise<MoodResult> {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  const model = getQwenVlModel();

  console.log(`[HearSpace AI] Qwen model: ${model}`);
  console.log(`[HearSpace AI] Qwen received image: ${Boolean(image)}`);
  console.log(`[HearSpace AI] Qwen image mime type: ${image.type || "(empty)"}`);
  console.log(`[HearSpace AI] Qwen image size: ${image.size}`);

  if (!apiKey) {
    throw new Error("DASHSCOPE_API_KEY is required for Qwen mood generation.");
  }

  const imageDataUrl = await fileToDataUrl(image);
  let response: Response | undefined;
  let responseBody: string | undefined;

  try {
    response = await fetch(DASH_SCOPE_COMPATIBLE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: HEARSPACE_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: HEARSPACE_USER_PROMPT,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl,
                },
              },
            ] satisfies DashScopeMessageContent[],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    responseBody = await response.text();

    if (!response.ok) {
      console.log("[HearSpace AI] Qwen raw response first 1000 chars:");
      console.log(responseBody.slice(0, 1000));
      console.log("[HearSpace AI] Schema validation passed: false");
      throw new QwenMoodError(
        `Qwen-VL request failed with status ${response.status} ${response.statusText}.`,
        "api_error",
      );
    }

    const payload = JSON.parse(responseBody);
    const rawResponse = JSON.stringify(payload);
    console.log("[HearSpace AI] Qwen raw response first 1000 chars:");
    console.log(rawResponse.slice(0, 1000));

    const content = payload?.choices?.[0]?.message?.content;
    const parsedMood = safeParseMoodResult(content);
    const { moodCore } = parsedMood;

    const schemaPassed = isMoodResultCore(moodCore);
    console.log(`[HearSpace AI] Schema validation passed: ${schemaPassed}`);

    if (!schemaPassed) {
      throw new QwenMoodError(
        "Qwen-VL returned an invalid MoodResult payload.",
        "invalid_schema",
      );
    }

    return {
      ...moodCore,
      debug_source: parsedMood.debugSource,
    };
  } catch (error) {
    console.error("[HearSpace AI] Qwen error status:", response?.status);
    console.error("[HearSpace AI] Qwen error statusText:", response?.statusText);
    console.error("[HearSpace AI] Qwen error response body:");
    console.error(responseBody ?? "(no response body)");
    console.error("[HearSpace AI] Qwen error message:", getErrorMessage(error));
    throw error;
  }
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}` as const;
}

function parseMoodContent(content: unknown): unknown {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return content;
  }

  if (typeof content === "string") {
    return JSON.parse(extractJsonText(content));
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (part && typeof part === "object" && "text" in part) {
          return (part as { text?: unknown }).text;
        }
        return "";
      })
      .filter((part): part is string => typeof part === "string")
      .join("");

    return JSON.parse(extractJsonText(text));
  }

  return content;
}

function safeParseMoodResult(content: unknown): ParsedMoodResult {
  let parsed: unknown;
  let parseFailed = false;

  try {
    parsed = parseMoodContent(content);
  } catch (error) {
    console.log("[HearSpace AI] Schema validation passed: false");
    console.warn(
      "[HearSpace AI] Qwen JSON parse failed; normalizing from raw content:",
      getErrorMessage(error),
    );
    parseFailed = true;
    parsed = extractLooseMoodFields(content);
  }

  const moodRecord = resolveMoodRecord(parsed);
  const normalized = normalizeMoodResult(moodRecord);
  const requiredStatus = getRequiredMoodCoreStatus(normalized);
  const completedMoodCore = completeMoodDefaults(normalized);
  const usedDefaults =
    parseFailed ||
    !requiredStatus.mood_title ||
    !requiredStatus.writing ||
    !requiredStatus.music_keywords ||
    normalized.time_label.trim().length === 0 ||
    normalized.space_personality.trim().length === 0 ||
    !normalized.music_recommendations ||
    normalized.music_recommendations.length === 0 ||
    normalized.visual_mood_tags.length === 0;

  console.log("[HearSpace AI] Parsed Qwen mood keys:", Object.keys(moodRecord));
  console.log("[HearSpace AI] Required mood core status:", requiredStatus);
  console.log("[HearSpace AI] Qwen normalized with defaults:", usedDefaults);

  return {
    moodCore: completedMoodCore,
    debugSource: usedDefaults ? "qwen_normalized" : "qwen",
  };
}

function normalizeMoodResult(value: unknown): MoodResultCore {
  const record = isRecord(value) ? value : {};
  const sceneObservationValue = getFirstValue(record, [
    "scene_observation",
    "sceneObservation",
  ]);
  const rawSceneObservation = isRecord(sceneObservationValue)
    ? sceneObservationValue
    : {};

  const sceneObservation = {
    primary_scene: toStringValue(getFirstValue(rawSceneObservation, ["primary_scene", "primaryScene"])),
    visible_objects: toStringArray(getFirstValue(rawSceneObservation, ["visible_objects", "visibleObjects"])),
    human_activity: toStringValue(getFirstValue(rawSceneObservation, ["human_activity", "humanActivity"])),
    lighting: toStringValue(rawSceneObservation.lighting),
    color_tone: toStringValue(getFirstValue(rawSceneObservation, ["color_tone", "colorTone"])),
    camera_style: toStringValue(getFirstValue(rawSceneObservation, ["camera_style", "cameraStyle"])),
    atmosphere_evidence: toStringArray(getFirstValue(rawSceneObservation, ["atmosphere_evidence", "atmosphereEvidence"])),
  };

  const musicKeywords = toStringArray(getFirstValue(record, ["music_keywords", "musicKeywords", "music", "keywords"]));
  const musicRecommendations = normalizeMusicRecommendations(
    getFirstValue(record, [
      "music_recommendations",
      "musicRecommendations",
      "music_memory",
      "musicMemory",
      "recommendations",
    ]),
  );
  const visualMoodTags = toStringArray(getFirstValue(record, ["visual_mood_tags", "visualMoodTags", "mood_tags", "tags"]));
  const timeLabel = toStringValue(getFirstValue(record, ["time_label", "timeLabel", "time"]));
  const spacePersonality =
    toStringValue(getFirstValue(record, ["space_personality", "spacePersonality", "personality"]));

  return {
    scene_observation: sceneObservation,
    mood_title: toStringValue(getFirstValue(record, ["mood_title", "moodTitle", "title"])),
    time_label: timeLabel,
    writing: toStringValue(getFirstValue(record, ["writing", "diary", "description", "caption"])),
    space_personality: spacePersonality,
    music_keywords: musicKeywords,
    music_recommendations: musicRecommendations,
    visual_mood_tags: visualMoodTags,
  };
}

function completeMoodDefaults(value: MoodResultCore): MoodResultCore {
  const sceneObservation = value.scene_observation;
  const primaryScene = sceneObservation.primary_scene.trim();
  const moodTitle = value.mood_title.trim() || createMoodTitle(sceneObservation);
  const writing = value.writing.trim() || createWriting(sceneObservation);
  const musicKeywords =
    value.music_keywords.length > 0
      ? value.music_keywords
      : createMusicKeywords(sceneObservation);
  const musicRecommendations =
    value.music_recommendations && value.music_recommendations.length > 0
      ? value.music_recommendations
      : createMusicRecommendations(musicKeywords, sceneObservation, value.visual_mood_tags);
  const visualMoodTags =
    value.visual_mood_tags.length > 0 ? value.visual_mood_tags : ["安静", "电影感"];

  return {
    scene_observation: {
      primary_scene: primaryScene || "space",
      visible_objects: sceneObservation.visible_objects,
      human_activity: sceneObservation.human_activity,
      lighting: sceneObservation.lighting,
      color_tone: sceneObservation.color_tone,
      camera_style: sceneObservation.camera_style,
      atmosphere_evidence: sceneObservation.atmosphere_evidence,
    },
    mood_title: moodTitle,
    time_label: value.time_label.trim() || "此刻",
    writing,
    space_personality:
      value.space_personality.trim() || "像一个安静保存光线的地方。",
    music_keywords: musicKeywords,
    music_recommendations: musicRecommendations,
    visual_mood_tags: visualMoodTags,
  };
}

function normalizeMusicRecommendations(value: unknown): MusicRecommendation[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return {
          title: item.trim(),
          reason: "",
          mood: "",
        };
      }

      if (!isRecord(item)) {
        return null;
      }

      const title = toStringValue(
        getFirstValue(item, ["title", "name", "song", "direction"]),
      ).trim();

      if (!title) {
        return null;
      }

      const artist = toStringValue(getFirstValue(item, ["artist", "singer"])).trim();

      return {
        title,
        ...(artist ? { artist } : {}),
        reason: toStringValue(getFirstValue(item, ["reason", "why", "description"])).trim(),
        mood: toStringValue(getFirstValue(item, ["mood", "feeling", "tag"])).trim(),
      };
    })
    .filter((item): item is MusicRecommendation => Boolean(item));
}

function extractLooseMoodFields(content: unknown): Record<string, unknown> {
  const text = contentToText(content);

  if (!text) {
    return {};
  }

  return {
    mood_title: extractLooseField(text, [
      "mood_title",
      "moodTitle",
      "title",
      "标题",
    ]),
    time_label: extractLooseField(text, [
      "time_label",
      "timeLabel",
      "time",
      "时间",
    ]),
    writing: extractLooseField(text, [
      "writing",
      "diary",
      "description",
      "文案",
      "日记",
    ]),
    space_personality: extractLooseField(text, [
      "space_personality",
      "spacePersonality",
      "personality",
      "空间人格",
    ]),
    music_keywords: extractLooseListField(text, [
      "music_keywords",
      "musicKeywords",
      "music",
      "keywords",
      "音乐",
    ]),
    visual_mood_tags: extractLooseListField(text, [
      "visual_mood_tags",
      "visualMoodTags",
      "tags",
      "标签",
    ]),
  };
}

function contentToText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (isRecord(part)) return toStringValue(part);
        return "";
      })
      .filter((part) => part.trim().length > 0)
      .join("\n");
  }

  if (isRecord(content)) {
    return JSON.stringify(content);
  }

  return "";
}

function extractLooseField(text: string, labels: string[]) {
  for (const label of labels) {
    const pattern = new RegExp(
      `["']?${escapeRegExp(label)}["']?\\s*[:：]\\s*["']?([^"'\\n,，}]+)`,
      "i",
    );
    const match = text.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "";
}

function extractLooseListField(text: string, labels: string[]) {
  for (const label of labels) {
    const arrayPattern = new RegExp(
      `["']?${escapeRegExp(label)}["']?\\s*[:：]\\s*\\[([^\\]]+)\\]`,
      "i",
    );
    const arrayMatch = text.match(arrayPattern);

    if (arrayMatch?.[1]) {
      return arrayMatch[1]
        .split(/[,，、\n]/)
        .map((item) => item.replace(/["']/g, "").trim())
        .filter((item) => item.length > 0);
    }

    const value = extractLooseField(text, [label]);

    if (value) {
      return value
        .split(/[,，、]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
  }

  return [];
}

function resolveMoodRecord(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    return {};
  }

  if (hasMoodLikeKeys(value)) {
    return value;
  }

  const wrapperKeys = [
    "result",
    "mood_result",
    "moodResult",
    "data",
    "output",
    "hearspace",
  ];

  for (const key of wrapperKeys) {
    const nestedValue = value[key];

    if (isRecord(nestedValue) && hasMoodLikeKeys(nestedValue)) {
      console.log(`[HearSpace AI] Qwen mood result found in wrapper: ${key}`);
      return nestedValue;
    }
  }

  return value;
}

function hasMoodLikeKeys(value: Record<string, unknown>) {
  return [
    "mood_title",
    "moodTitle",
    "writing",
    "music_keywords",
    "musicKeywords",
    "scene_observation",
    "sceneObservation",
  ].some((key) => key in value);
}

function extractJsonText(text: string) {
  const trimmedText = text.trim();
  const codeFenceMatch = trimmedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (codeFenceMatch?.[1]) {
    return codeFenceMatch[1].trim();
  }

  const jsonStart = trimmedText.indexOf("{");

  if (jsonStart === -1) {
    return trimmedText;
  }

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = jsonStart; index < trimmedText.length; index += 1) {
    const char = trimmedText[index];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (char === "\\") {
      isEscaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      depth += 1;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return trimmedText.slice(jsonStart, index + 1);
      }
    }
  }

  return trimmedText.slice(jsonStart);
}

function getRequiredMoodCoreStatus(value: MoodResultCore) {
  return {
    mood_title: value.mood_title.trim().length > 0,
    writing: value.writing.trim().length > 0,
    music_keywords: value.music_keywords.length > 0,
  };
}

function createTimeLabel(sceneObservation: MoodResultCore["scene_observation"]) {
  const evidence = [
    sceneObservation.lighting,
    sceneObservation.color_tone,
    sceneObservation.primary_scene,
  ]
    .join(" ")
    .toLowerCase();

  if (evidence.includes("night") || evidence.includes("dark")) {
    return "Night";
  }

  if (evidence.includes("morning") || evidence.includes("sunrise")) {
    return "Morning";
  }

  if (evidence.includes("afternoon") || evidence.includes("sunset")) {
    return "Afternoon";
  }

  if (evidence.includes("warm") || evidence.includes("lamp")) {
    return "Warm evening";
  }

  return sceneObservation.lighting || "Unspecified time";
}

function createMoodTitle(sceneObservation: MoodResultCore["scene_observation"]) {
  const scene = sceneObservation.primary_scene.toLowerCase();
  const evidence = [
    sceneObservation.primary_scene,
    ...sceneObservation.visible_objects,
    sceneObservation.lighting,
    sceneObservation.color_tone,
    ...sceneObservation.atmosphere_evidence,
  ]
    .join(" ")
    .toLowerCase();

  if (
    evidence.includes("flower") ||
    evidence.includes("garden") ||
    evidence.includes("tree") ||
    evidence.includes("花") ||
    evidence.includes("庭") ||
    evidence.includes("园")
  ) {
    return "春日花园";
  }

  if (scene.includes("street") || scene.includes("road") || evidence.includes("街")) {
    return "夜路片段";
  }

  if (
    scene.includes("restaurant") ||
    scene.includes("dinner") ||
    evidence.includes("餐")
  ) {
    return "夏夜餐桌";
  }

  if (scene.includes("cafe") || evidence.includes("咖啡")) {
    return "午后咖啡馆";
  }

  if (scene.includes("room") || evidence.includes("房间")) {
    return "房间里的光";
  }

  return primarySceneToChinese(sceneObservation.primary_scene);
}

function createWriting(sceneObservation: MoodResultCore["scene_observation"]) {
  const scene = primarySceneToChinese(sceneObservation.primary_scene);
  const light = sceneObservation.lighting || sceneObservation.color_tone;

  if (light) {
    return `${scene}把${light}轻轻留住。\n像一段没有说出口的电影片尾。`;
  }

  return `${scene}安静地停在画面里。\n像某个被晚风保存下来的片刻。`;
}

function createMusicKeywords(sceneObservation: MoodResultCore["scene_observation"]) {
  const evidence = [
    sceneObservation.primary_scene,
    ...sceneObservation.visible_objects,
    ...sceneObservation.atmosphere_evidence,
  ]
    .join(" ")
    .toLowerCase();

  if (
    evidence.includes("garden") ||
    evidence.includes("flower") ||
    evidence.includes("tree") ||
    evidence.includes("courtyard") ||
    evidence.includes("花") ||
    evidence.includes("庭") ||
    evidence.includes("园")
  ) {
    return ["garden ambient", "soft piano", "spring afternoon"];
  }

  if (
    evidence.includes("street") ||
    evidence.includes("city") ||
    evidence.includes("night") ||
    evidence.includes("街") ||
    evidence.includes("夜")
  ) {
    return ["city pop", "soft cinematic", "slow ambient"];
  }

  return ["soft piano", "slow ambient", "pastel memory"];
}

function createMusicRecommendations(
  musicKeywords: string[],
  sceneObservation: MoodResultCore["scene_observation"],
  visualMoodTags: string[],
): MusicRecommendation[] {
  const scene = primarySceneToChinese(sceneObservation.primary_scene);
  const moodSeeds = visualMoodTags.length > 0 ? visualMoodTags : ["春日记忆", "安静", "电影感"];

  return musicKeywords.slice(0, 3).map((keyword, index) => ({
    title: keyword,
    reason: createMusicReason(keyword, scene, sceneObservation),
    mood: moodSeeds[index] ?? moodSeeds[0] ?? "电影感",
  }));
}

function createMusicReason(
  keyword: string,
  scene: string,
  sceneObservation: MoodResultCore["scene_observation"],
) {
  const evidence =
    sceneObservation.lighting ||
    sceneObservation.color_tone ||
    sceneObservation.atmosphere_evidence[0];

  if (evidence) {
    return `${keyword}适合${scene}里这层${evidence}，像给画面留下一枚安静的记忆锚点。`;
  }

  return `${keyword}适合${scene}的气质，让空间不只是被看见，也像被轻轻记住。`;
}

function primarySceneToChinese(primaryScene: string) {
  const scene = primaryScene.trim().toLowerCase();

  if (!scene) return "此刻空间";
  if (scene.includes("garden") || scene.includes("flower")) return "春日花园";
  if (scene.includes("courtyard")) return "雨后天井";
  if (scene.includes("restaurant") || scene.includes("dinner")) return "夏夜餐桌";
  if (scene.includes("cafe")) return "午后咖啡馆";
  if (scene.includes("street") || scene.includes("road")) return "夜路";
  if (scene.includes("room") || scene.includes("bedroom")) return "房间";
  if (scene.includes("sky")) return "天空";
  if (scene.includes("water") || scene.includes("river")) return "水边";

  return primaryScene;
}

function toStringValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value
      .map((item) => toStringValue(item).trim())
      .filter((item) => item.length > 0)
      .join("\n");
  }
  if (isRecord(value)) {
    return toStringValue(
      getFirstValue(value, ["text", "keyword", "name", "value", "title", "label"]),
    );
  }
  return "";
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => toStringValue(item).trim())
      .filter((item) => item.length > 0);
  }

  const stringValue = toStringValue(value).trim();

  return stringValue ? [stringValue] : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getFirstValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (key in record) {
      return record[key];
    }
  }

  return undefined;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
