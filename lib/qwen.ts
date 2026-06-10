import {
  HEARSPACE_SYSTEM_PROMPT,
  createHearspaceUserPrompt,
} from "@/lib/prompts";
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
  userNote?: string;
};

export type QwenMoodTitleResult = {
  mood_title: string;
  mood_subtitle: string;
  time_label: string;
};

type DashScopeMessageContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: `data:${string};base64,${string}` } };

const DASH_SCOPE_COMPATIBLE_URL =
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const DEFAULT_QWEN_VL_MODEL = "qwen3-vl-plus";
const DEFAULT_QWEN_TIMEOUT_MS = 22000;

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
  userNote,
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
  const abortController = new AbortController();
  const timeoutMs = getQwenTimeoutMs();
  const timeout = setTimeout(() => abortController.abort(), timeoutMs);
  let response: Response | undefined;
  let responseBody: string | undefined;

  try {
    response = await fetch(DASH_SCOPE_COMPATIBLE_URL, {
      method: "POST",
      signal: abortController.signal,
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
                text: createHearspaceUserPrompt(userNote),
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
        max_tokens: 1200,
        temperature: 0.35,
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
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateMoodTitleWithQwen({
  image,
  userNote,
}: GenerateMoodWithQwenParams): Promise<QwenMoodTitleResult> {
  const prompt = [
    "你是 HearSpace 的空间标题编辑器。",
    "请只根据图片真实内容，为这段空间生成第一阶段标题。",
    "不要解释，不要描述模型，不要写 AI 分析。",
    "输出 JSON，只包含 mood_title, mood_subtitle, time_label。",
    "mood_title：2-6字，像空间记忆标题。",
    "mood_subtitle：12-24字，像电影字幕。",
    "time_label：2-6字，没有明确证据写 此刻。",
    userNote?.trim() ? `用户补充语境：${userNote.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const parsed = await requestQwenJson({
    image,
    prompt,
    maxTokens: 320,
    timeoutMs: 9000,
  });
  const record = isRecord(parsed) ? parsed : {};

  return {
    mood_title: toStringValue(record.mood_title || record.moodTitle || record.title) || "正在浮现",
    mood_subtitle:
      toStringValue(record.mood_subtitle || record.moodSubtitle || record.subtitle) ||
      "一些情绪正在靠近。",
    time_label: toStringValue(record.time_label || record.timeLabel || record.time) || "此刻",
  };
}

async function requestQwenJson({
  image,
  prompt,
  maxTokens,
  timeoutMs,
}: {
  image: File;
  prompt: string;
  maxTokens: number;
  timeoutMs: number;
}) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  const model = getQwenVlModel();

  if (!apiKey) {
    throw new Error("DASHSCOPE_API_KEY is required for Qwen mood generation.");
  }

  const imageDataUrl = await fileToDataUrl(image);
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const response = await fetch(DASH_SCOPE_COMPATIBLE_URL, {
      method: "POST",
      signal: abortController.signal,
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
                text: prompt,
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
        max_tokens: maxTokens,
        temperature: 0.32,
      }),
    });
    const responseBody = await response.text();

    if (!response.ok) {
      throw new QwenMoodError(
        `Qwen-VL request failed with status ${response.status} ${response.statusText}.`,
        "api_error",
      );
    }

    const payload = JSON.parse(responseBody);
    return parseMoodContent(payload?.choices?.[0]?.message?.content);
  } finally {
    clearTimeout(timeout);
  }
}

function getQwenTimeoutMs() {
  const parsed = Number(process.env.QWEN_VL_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed >= 5000
    ? parsed
    : DEFAULT_QWEN_TIMEOUT_MS;
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
    !requiredStatus.space_memory_text ||
    !requiredStatus.music_query ||
    normalized.time_label.trim().length === 0 ||
    normalized.mood_subtitle.trim().length === 0 ||
    normalized.space_personality.trim().length === 0 ||
    normalized.music_memories.length === 0 ||
    normalized.visual_tone.length === 0 ||
    normalized.share_card_text.trim().length === 0;

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

  const visualTone = toStringArray(getFirstValue(record, ["visual_tone", "visualTone", "visual_mood_tags", "visualMoodTags", "mood_tags", "tags"]));
  const musicQuery = toStringValue(getFirstValue(record, ["music_query", "musicQuery", "music_search", "musicSearch"]));
  const musicKeywords = toStringArray(getFirstValue(record, ["music_keywords", "musicKeywords", "music", "keywords"]));
  const musicMemories = normalizeMusicRecommendations(
    getFirstValue(record, [
      "music_memories",
      "musicMemories",
      "music_recommendations",
      "musicRecommendations",
      "recommendations",
    ]),
  );
  const musicRecommendations = normalizeMusicRecommendations(
    getFirstValue(record, [
      "music_recommendations",
      "musicRecommendations",
      "music_memories",
      "musicMemories",
      "music_memory",
      "musicMemory",
      "recommendations",
    ]),
  );
  const visualMoodTags = toStringArray(getFirstValue(record, ["visual_mood_tags", "visualMoodTags", "visual_tone", "visualTone", "mood_tags", "tags"]));
  const timeLabel = toStringValue(getFirstValue(record, ["time_label", "timeLabel", "time"]));
  const spacePersonality =
    toStringValue(getFirstValue(record, ["space_personality", "spacePersonality", "personality"]));
  const spaceMemoryText = toStringValue(
    getFirstValue(record, [
      "space_memory_text",
      "spaceMemoryText",
      "writing",
      "diary",
      "description",
      "caption",
    ]),
  );

  return {
    scene_observation: sceneObservation,
    spaceTags: toStringArray(getFirstValue(record, ["spaceTags", "space_tags"])),
    sceneTags: toStringArray(getFirstValue(record, ["sceneTags", "scene_tags"])),
    emotionTags: toStringArray(getFirstValue(record, ["emotionTags", "emotion_tags"])),
    memoryTags: toStringArray(getFirstValue(record, ["memoryTags", "memory_tags"])),
    visualTags: toStringArray(getFirstValue(record, ["visualTags", "visual_tags"])),
    seasonTags: toStringArray(getFirstValue(record, ["seasonTags", "season_tags"])),
    mood_title: toStringValue(getFirstValue(record, ["mood_title", "moodTitle", "title"])),
    mood_subtitle: toStringValue(getFirstValue(record, ["mood_subtitle", "moodSubtitle", "subtitle"])),
    time_label: timeLabel,
    writing: toStringValue(getFirstValue(record, ["writing", "diary", "description", "caption", "space_memory_text", "spaceMemoryText"])),
    space_memory_text: spaceMemoryText,
    space_personality: spacePersonality,
    visual_tone: visualTone,
    music_query: musicQuery,
    music_keywords: musicKeywords,
    music_memories: musicMemories,
    music_recommendations: musicRecommendations,
    share_card_text: toStringValue(getFirstValue(record, ["share_card_text", "shareCardText", "share_text", "shareText"])),
    visual_mood_tags: visualMoodTags,
  };
}

function completeMoodDefaults(value: MoodResultCore): MoodResultCore {
  const sceneObservation = value.scene_observation;
  const primaryScene = sceneObservation.primary_scene.trim();
  const moodTitle = value.mood_title.trim() || createMoodTitle(sceneObservation);
  const spaceMemoryText =
    value.space_memory_text.trim() || value.writing.trim() || createWriting(sceneObservation);
  const writing = value.writing.trim() || spaceMemoryText;
  const visualTone =
    value.visual_tone.length > 0
      ? value.visual_tone.slice(0, 4)
      : value.visual_mood_tags.length > 0
        ? value.visual_mood_tags.slice(0, 4)
        : createVisualTone(sceneObservation);
  const musicQuery =
    value.music_query.trim() ||
    createMusicQuery(value.music_keywords, sceneObservation, visualTone);
  const musicKeywords =
    value.music_keywords.length > 0
      ? value.music_keywords
      : splitMusicQuery(musicQuery);
  const musicRecommendations =
    value.music_recommendations && value.music_recommendations.length > 0
      ? value.music_recommendations
      : value.music_memories;
  const musicMemories =
    value.music_memories.length > 0
      ? value.music_memories.slice(0, 3)
      : createMusicRecommendations(musicKeywords, sceneObservation, visualTone).slice(0, 3);
  const visualMoodTags =
    value.visual_mood_tags.length > 0 ? value.visual_mood_tags : visualTone;
  const moodSubtitle =
    value.mood_subtitle.trim() || createMoodSubtitle(sceneObservation, visualTone);
  const shareCardText =
    value.share_card_text.trim() || createShareCardText(spaceMemoryText, moodSubtitle);

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
    spaceTags: value.spaceTags,
    sceneTags: value.sceneTags,
    emotionTags: value.emotionTags,
    memoryTags: value.memoryTags,
    visualTags: value.visualTags,
    seasonTags: value.seasonTags,
    mood_title: moodTitle,
    mood_subtitle: moodSubtitle,
    time_label: value.time_label.trim() || "此刻",
    writing,
    space_memory_text: spaceMemoryText,
    space_personality:
      value.space_personality.trim() || createSpacePersonality(sceneObservation),
    visual_tone: visualTone,
    music_query: musicQuery,
    music_keywords: musicKeywords,
    music_memories: musicMemories,
    music_recommendations:
      musicRecommendations && musicRecommendations.length > 0
        ? musicRecommendations.slice(0, 3)
        : musicMemories,
    share_card_text: shareCardText,
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
      "space_memory_text",
      "spaceMemoryText",
      "diary",
      "description",
      "文案",
      "日记",
      "空间记忆",
    ]),
    mood_subtitle: extractLooseField(text, [
      "mood_subtitle",
      "moodSubtitle",
      "subtitle",
      "副标题",
    ]),
    space_memory_text: extractLooseField(text, [
      "space_memory_text",
      "spaceMemoryText",
      "writing",
      "空间记忆",
      "正文",
    ]),
    space_personality: extractLooseField(text, [
      "space_personality",
      "spacePersonality",
      "personality",
      "空间人格",
    ]),
    visual_tone: extractLooseListField(text, [
      "visual_tone",
      "visualTone",
      "visual_mood_tags",
      "视觉氛围",
    ]),
    music_query: extractLooseField(text, [
      "music_query",
      "musicQuery",
      "网易云",
      "音乐搜索",
    ]),
    music_keywords: extractLooseListField(text, [
      "music_keywords",
      "musicKeywords",
      "music_query",
      "music",
      "keywords",
      "音乐",
    ]),
    share_card_text: extractLooseField(text, [
      "share_card_text",
      "shareCardText",
      "分享文案",
      "分享卡片",
    ]),
    visual_mood_tags: extractLooseListField(text, [
      "visual_mood_tags",
      "visualMoodTags",
      "visual_tone",
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
    "mood_subtitle",
    "moodSubtitle",
    "writing",
    "space_memory_text",
    "spaceMemoryText",
    "music_query",
    "musicQuery",
    "music_keywords",
    "musicKeywords",
    "visual_tone",
    "visualTone",
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
    mood_subtitle: value.mood_subtitle.trim().length > 0,
    space_memory_text: value.space_memory_text.trim().length > 0,
    music_query: value.music_query.trim().length > 0,
    share_card_text: value.share_card_text.trim().length > 0,
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
    return `${scene}把这层光轻轻留住。画面没有急着解释什么，只让颜色、材质和空气慢慢靠近，像一段被保存下来的日常。`;
  }

  return `${scene}安静地停在画面里。没有多余的声音，只剩空间本身慢慢展开，像某个被轻轻记住的片刻。`;
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
    return ["春日", "花园", "温柔", "华语"];
  }

  if (
    evidence.includes("street") ||
    evidence.includes("city") ||
    evidence.includes("night") ||
    evidence.includes("街") ||
    evidence.includes("夜")
  ) {
    return ["深夜", "城市", "独立音乐"];
  }

  return ["安静", "空间", "温柔", "华语"];
}

function createMoodSubtitle(
  sceneObservation: MoodResultCore["scene_observation"],
  visualTone: string[],
) {
  const tone = visualTone[0] || sceneObservation.lighting || "空气";
  const scene = primarySceneToChinese(sceneObservation.primary_scene);

  return `${tone}停在${scene}里，时间慢了下来。`;
}

function createSpacePersonality(sceneObservation: MoodResultCore["scene_observation"]) {
  const scene = primarySceneToChinese(sceneObservation.primary_scene);

  return `${scene}像一个安静保存光线的地方。`;
}

function createVisualTone(sceneObservation: MoodResultCore["scene_observation"]) {
  const tones = [
    sceneObservation.lighting,
    sceneObservation.color_tone,
    ...sceneObservation.atmosphere_evidence,
  ]
    .map((item) => item.trim())
    .filter(Boolean);

  return (tones.length > 0 ? tones : ["柔光", "安静空气"]).slice(0, 4);
}

function createMusicQuery(
  musicKeywords: string[],
  sceneObservation: MoodResultCore["scene_observation"],
  visualTone: string[],
) {
  if (musicKeywords.length > 0) {
    return musicKeywords.slice(0, 4).join(" ");
  }

  const scene = primarySceneToChinese(sceneObservation.primary_scene);
  const tone = visualTone[0] || "温柔";

  return `${tone} ${scene} 华语`;
}

function splitMusicQuery(musicQuery: string) {
  return musicQuery
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function createShareCardText(spaceMemoryText: string, moodSubtitle: string) {
  const source = (spaceMemoryText || moodSubtitle).replace(/\s+/g, "");
  const firstSentence = source.split(/[。！？!?]/)[0];

  if (firstSentence.length >= 20 && firstSentence.length <= 40) {
    return `${firstSentence}。`;
  }

  if (firstSentence.length > 40) {
    return `${firstSentence.slice(0, 38)}。`;
  }

  return moodSubtitle || "这一刻安静下来，像被空间轻轻记住。";
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
    return `适合${scene}里这层安静。`;
  }

  return `像给${scene}留下一点余温。`;
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
