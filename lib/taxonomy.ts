import type { MoodResult } from "@/lib/mood-schema";
import type { SpaceMemoryType } from "@/lib/space-memory-taxonomy";
import { tokenize, uniqueStrings } from "@/lib/visual-grounding";

export const spaceTags = [
  "Natural Space",
  "Urban Space",
  "Residential Space",
  "Transit Space",
  "Campus Space",
  "Travel Space",
  "Commercial Space",
  "Solitude Space",
] as const;

export const sceneTags = [
  "Classroom",
  "Corridor",
  "Playground",
  "Library",
  "Garden",
  "Park",
  "Lakeside",
  "Forest",
  "Night Street",
  "Convenience Store",
  "Subway",
  "Rooftop",
  "Room",
  "Window",
  "Kitchen",
  "Balcony",
  "Train Window",
  "Airport Waiting",
  "Road Trip Sunset",
  "Cafe",
  "Restaurant",
  "Mall",
  "Hotel",
  "After School",
] as const;

export const emotionTags = [
  "Youth",
  "Warm",
  "Nostalgic",
  "Lonely",
  "Healing",
  "Dreamy",
  "Quiet",
  "Free",
  "Tender",
  "Melancholy",
  "Romantic",
  "Restorative",
  "Bittersweet",
  "Light",
] as const;

export const memoryTags = [
  "Graduation",
  "First Love",
  "After School",
  "City Walk",
  "Night Walk",
  "Rainy Window",
  "Daily Ritual",
  "Long Trip",
  "Waiting",
  "Farewell",
  "Old Photo",
  "Private Room",
  "Soft Bloom",
] as const;

export const visualTags = [
  "Rainy",
  "Sunset",
  "Warm Light",
  "Golden Hour",
  "Soft Focus",
  "Film Look",
  "Green Shadow",
  "Neon",
  "Blue Hour",
  "Low Light",
  "Window Light",
  "Water Reflection",
  "Pink Bloom",
  "Muted Color",
] as const;

export const seasonTags = [
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
  "Rain Season",
  "All Season",
] as const;

export const atmosphereTags = [
  "Rainy",
  "Sunset",
  "Warm Light",
  "Soft Focus",
  "Quiet",
  "Nostalgic",
  "Dreamy",
  "Lonely",
  "Healing",
  "Summer",
  "City Night",
  "After Rain",
  "Slow Afternoon",
] as const;

export const spaceMemoryTaxonomyV2 = {
  "Natural Space": ["Garden", "Park", "Lakeside", "Forest"],
  "Urban Space": ["Night Street", "Convenience Store", "Subway", "Rooftop"],
  "Residential Space": ["Room", "Window", "Kitchen", "Balcony"],
  "Transit Space": ["Train Window", "Airport Waiting", "Road Trip Sunset", "Subway"],
  "Campus Space": ["Classroom", "Corridor", "Playground", "Library", "After School"],
  "Travel Space": ["Road Trip Sunset", "Airport Waiting", "Train Window", "Hotel"],
  "Commercial Space": ["Cafe", "Restaurant", "Mall", "Convenience Store", "Hotel"],
  "Solitude Space": ["Window", "Room", "Night Street", "Train Window"],
} as const satisfies Record<SpaceTag, readonly SceneTag[]>;

export type SpaceTag = (typeof spaceTags)[number];
export type SceneTag = (typeof sceneTags)[number];
export type EmotionTag = (typeof emotionTags)[number];
export type MemoryTag = (typeof memoryTags)[number];
export type VisualTag = (typeof visualTags)[number];
export type SeasonTag = (typeof seasonTags)[number];
export type AtmosphereTag = (typeof atmosphereTags)[number];

export type MusicKnowledgeTags = {
  spaceTags: SpaceTag[];
  sceneTags: SceneTag[];
  emotionTags: EmotionTag[];
  memoryTags: MemoryTag[];
  visualTags: VisualTag[];
  seasonTags: SeasonTag[];
  atmosphereTags: AtmosphereTag[];
  similarSpaces: SceneTag[];
};

const legacySpaceMap: Record<SpaceMemoryType, SpaceTag[]> = {
  campus_youth: ["Campus Space"],
  city_park_restorative: ["Natural Space", "Urban Space"],
  night_city_dining: ["Urban Space", "Commercial Space"],
  rain_window_solitude: ["Solitude Space", "Residential Space"],
  chinese_garden_water: ["Natural Space"],
  flower_dream_portrait: ["Natural Space"],
  travel_landscape: ["Travel Space", "Transit Space"],
  daily_life_home: ["Residential Space", "Solitude Space"],
  unknown_soft_memory: ["Solitude Space"],
};

const aliasRules = [
  { tag: "Classroom", words: ["教室", "课桌", "黑板", "classroom"] },
  { tag: "Corridor", words: ["走廊", "corridor"] },
  { tag: "Playground", words: ["操场", "playground"] },
  { tag: "Library", words: ["图书馆", "library"] },
  { tag: "Garden", words: ["花园", "园林", "庭院", "garden"] },
  { tag: "Park", words: ["公园", "草地", "城市绿地", "park"] },
  { tag: "Lakeside", words: ["湖", "水面", "河边", "lakeside"] },
  { tag: "Forest", words: ["树林", "森林", "forest"] },
  { tag: "Night Street", words: ["夜路", "街道", "街角", "深夜城市", "night street"] },
  { tag: "Convenience Store", words: ["便利店", "convenience"] },
  { tag: "Subway", words: ["地铁", "subway"] },
  { tag: "Rooftop", words: ["天台", "屋顶", "rooftop"] },
  { tag: "Room", words: ["房间", "卧室", "客厅", "room"] },
  { tag: "Window", words: ["窗边", "窗户", "window"] },
  { tag: "Kitchen", words: ["厨房", "kitchen"] },
  { tag: "Balcony", words: ["阳台", "balcony"] },
  { tag: "Train Window", words: ["车窗", "高铁", "火车", "train"] },
  { tag: "Airport Waiting", words: ["机场", "候机", "airport"] },
  { tag: "Road Trip Sunset", words: ["路上", "旅途", "远方", "海边", "road trip"] },
  { tag: "Cafe", words: ["咖啡", "cafe"] },
  { tag: "Restaurant", words: ["餐厅", "酒杯", "restaurant"] },
  { tag: "Hotel", words: ["酒店", "hotel"] },
  { tag: "After School", words: ["放学", "下课", "毕业", "after school"] },
] as const satisfies Array<{ tag: SceneTag; words: readonly string[] }>;

const emotionAliasRules = [
  { tag: "Youth", words: ["青春", "校园", "少年", "youth"] },
  { tag: "Warm", words: ["温暖", "暖色", "暖灯", "warm"] },
  { tag: "Nostalgic", words: ["怀念", "回忆", "旧", "nostalgic"] },
  { tag: "Lonely", words: ["孤独", "独处", "一个人", "lonely"] },
  { tag: "Healing", words: ["治愈", "恢复", "松弛", "healing"] },
  { tag: "Dreamy", words: ["梦幻", "柔光", "dreamy"] },
  { tag: "Quiet", words: ["安静", "静", "quiet"] },
  { tag: "Free", words: ["自由", "开阔", "远方", "free"] },
  { tag: "Tender", words: ["温柔", "柔软", "tender"] },
  { tag: "Melancholy", words: ["低落", "阴天", "思念", "melancholy"] },
  { tag: "Romantic", words: ["喜欢", "暧昧", "浪漫", "romantic"] },
  { tag: "Restorative", words: ["恢复性", "呼吸", "restorative"] },
  { tag: "Bittersweet", words: ["遗憾", "告别", "错过", "bittersweet"] },
  { tag: "Light", words: ["明亮", "轻盈", "晴朗", "light"] },
] as const satisfies Array<{ tag: EmotionTag; words: readonly string[] }>;

const visualAliasRules = [
  { tag: "Rainy", words: ["雨", "雨后", "湿润", "rain"] },
  { tag: "Sunset", words: ["黄昏", "傍晚", "sunset"] },
  { tag: "Warm Light", words: ["暖光", "暖灯", "暖色", "warm light"] },
  { tag: "Golden Hour", words: ["金色", "午后", "golden"] },
  { tag: "Soft Focus", words: ["柔光", "soft"] },
  { tag: "Film Look", words: ["胶片", "电影感", "film"] },
  { tag: "Green Shadow", words: ["绿色", "树影", "草地", "green"] },
  { tag: "Neon", words: ["霓虹", "neon"] },
  { tag: "Blue Hour", words: ["灰蓝", "蓝黑", "blue"] },
  { tag: "Low Light", words: ["暗色", "低光", "深夜", "low light"] },
  { tag: "Window Light", words: ["窗边", "窗户", "window light"] },
  { tag: "Water Reflection", words: ["水面", "倒影", "water"] },
  { tag: "Pink Bloom", words: ["粉色", "玫瑰", "花瓣", "pink"] },
  { tag: "Muted Color", words: ["低饱和", "灰", "muted"] },
] as const satisfies Array<{ tag: VisualTag; words: readonly string[] }>;

export function buildMusicKnowledgeTags(input: {
  memoryTypes?: SpaceMemoryType[];
  scenes?: string[];
  emotions?: string[];
  visibleObjects?: string[];
  timeFeelings?: string[];
  colorFeelings?: string[];
  culturalSignals?: string[];
  title?: string;
  artist?: string;
  description?: string;
}): MusicKnowledgeTags {
  const textValues = uniqueStrings([
    input.title,
    input.artist,
    input.description,
    ...(input.scenes ?? []),
    ...(input.emotions ?? []),
    ...(input.visibleObjects ?? []),
    ...(input.timeFeelings ?? []),
    ...(input.colorFeelings ?? []),
    ...(input.culturalSignals ?? []),
  ]);
  const text = textValues.join(" ").toLowerCase();
  const sceneMatches = matchByAlias(text, aliasRules);
  const emotionMatches = matchByAlias(text, emotionAliasRules);
  const visualMatches = matchByAlias(text, visualAliasRules);
  const spaceMatches = uniqueStrings([
    ...(input.memoryTypes ?? []).flatMap((type) => legacySpaceMap[type] ?? []),
    ...sceneMatches.flatMap((sceneTag) => spaceTagsForScene(sceneTag)),
  ]) as SpaceTag[];
  const memoryMatches = inferMemoryTags(text, sceneMatches, emotionMatches);
  const seasonMatches = inferSeasonTags(text);
  const atmosphereMatches = inferAtmosphereTags(text, emotionMatches, visualMatches);

  return {
    spaceTags: fallback(spaceMatches, ["Solitude Space"]),
    sceneTags: fallback(sceneMatches, ["Window"]),
    emotionTags: fallback(emotionMatches, ["Quiet"]),
    memoryTags: fallback(memoryMatches, ["Old Photo"]),
    visualTags: fallback(visualMatches, ["Film Look"]),
    seasonTags: fallback(seasonMatches, ["All Season"]),
    atmosphereTags: fallback(atmosphereMatches, ["Quiet"]),
    similarSpaces: createSimilarSpaces(sceneMatches, spaceMatches),
  };
}

export function inferMoodTaxonomyTags(result: MoodResult): MusicKnowledgeTags {
  const scene = result.scene_observation;

  return buildMusicKnowledgeTags({
    scenes: [scene.primary_scene, ...scene.visible_objects],
    emotions: [
      result.mood_title,
      result.mood_subtitle,
      result.space_memory_text,
      result.space_personality,
      ...result.visual_mood_tags,
      ...result.music_keywords,
    ],
    visibleObjects: scene.atmosphere_evidence,
    timeFeelings: [result.time_label],
    colorFeelings: [scene.lighting, scene.color_tone, ...result.visual_tone],
    title: result.mood_title,
    description: result.writing,
  });
}

function matchByAlias<T extends string>(
  text: string,
  rules: readonly { tag: T; words: readonly string[] }[],
) {
  return uniqueStrings(
    rules
      .filter((rule) =>
        rule.words.some((word) =>
          tokenize(text).some(
            (token) =>
              token === word.toLowerCase() ||
              token.includes(word.toLowerCase()) ||
              word.toLowerCase().includes(token),
          ) || text.includes(word.toLowerCase()),
        ),
      )
      .map((rule) => rule.tag),
  ) as T[];
}

function spaceTagsForScene(sceneTag: SceneTag): SpaceTag[] {
  return spaceTags.filter((spaceTag) =>
    (spaceMemoryTaxonomyV2[spaceTag] as readonly SceneTag[]).includes(sceneTag),
  );
}

function inferMemoryTags(
  text: string,
  scenes: SceneTag[],
  emotions: EmotionTag[],
): MemoryTag[] {
  return uniqueStrings([
    ...(scenes.some((scene) => ["Classroom", "Playground", "After School"].includes(scene))
      ? ["After School", "Graduation"]
      : []),
    ...(emotions.includes("Romantic") ? ["First Love"] : []),
    ...(emotions.includes("Bittersweet") ? ["Farewell"] : []),
    ...(emotions.includes("Lonely") ? ["Rainy Window", "Waiting"] : []),
    ...(scenes.some((scene) => ["Train Window", "Airport Waiting", "Road Trip Sunset"].includes(scene))
      ? ["Long Trip", "Waiting"]
      : []),
    ...(scenes.some((scene) => ["Room", "Kitchen", "Balcony"].includes(scene))
      ? ["Daily Ritual", "Private Room"]
      : []),
    ...(text.includes("花") || text.includes("柔光") ? ["Soft Bloom"] : []),
    ...(text.includes("旧") || text.includes("回忆") ? ["Old Photo"] : []),
  ]) as MemoryTag[];
}

function inferSeasonTags(text: string): SeasonTag[] {
  return uniqueStrings([
    ...(text.includes("春") || text.includes("花") ? ["Spring"] : []),
    ...(text.includes("夏") || text.includes("海") || text.includes("晴") ? ["Summer"] : []),
    ...(text.includes("秋") ? ["Autumn"] : []),
    ...(text.includes("冬") || text.includes("雪") || text.includes("冷") ? ["Winter"] : []),
    ...(text.includes("雨") ? ["Rain Season"] : []),
  ]) as SeasonTag[];
}

function inferAtmosphereTags(
  text: string,
  emotions: EmotionTag[],
  visuals: VisualTag[],
): AtmosphereTag[] {
  return uniqueStrings([
    ...(visuals.includes("Rainy") ? ["Rainy", "After Rain"] : []),
    ...(visuals.includes("Sunset") ? ["Sunset"] : []),
    ...(visuals.includes("Warm Light") ? ["Warm Light"] : []),
    ...(visuals.includes("Soft Focus") ? ["Soft Focus"] : []),
    ...(emotions.includes("Quiet") ? ["Quiet"] : []),
    ...(emotions.includes("Nostalgic") ? ["Nostalgic"] : []),
    ...(emotions.includes("Dreamy") ? ["Dreamy"] : []),
    ...(emotions.includes("Lonely") ? ["Lonely"] : []),
    ...(emotions.includes("Healing") ? ["Healing"] : []),
    ...(text.includes("夏") ? ["Summer"] : []),
    ...(text.includes("深夜") || text.includes("霓虹") ? ["City Night"] : []),
    ...(text.includes("午后") ? ["Slow Afternoon"] : []),
  ]) as AtmosphereTag[];
}

function createSimilarSpaces(scenes: SceneTag[], spaces: SpaceTag[]): SceneTag[] {
  const related = spaces.flatMap((spaceTag) => spaceMemoryTaxonomyV2[spaceTag]);

  return fallback(
    uniqueStrings([...scenes, ...related]).slice(0, 4) as SceneTag[],
    ["Window", "Night Street", "Train Window"],
  );
}

function fallback<T extends string>(values: T[], fallbackValues: T[]) {
  return values.length ? values : fallbackValues;
}
