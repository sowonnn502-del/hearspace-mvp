import type { MoodResult } from "@/lib/mood-schema";
import {
  CULTURAL_SIGNAL_TRIGGERS,
  spaceMemoryTaxonomy,
  type SpaceMemoryType,
} from "@/lib/space-memory-taxonomy";

export type MusicSong = {
  id: string;
  title: string;
  artist: string;
  neteaseKeyword: string;
  neteaseSongId?: string;
  album?: string;
  coverUrl?: string;
  memoryTypes: SpaceMemoryType[];
  scenes: string[];
  visibleObjects: string[];
  emotions: string[];
  timeFeelings: string[];
  reason?: string;
};

export type CuratedMusicTrack = MusicSong;

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

export type MusicMemoryRecommendation = {
  song: MusicSong;
  score: number;
  reason: string;
  matchedSignals: string[];
};

type SongInput = Omit<MusicSong, "id" | "neteaseKeyword"> & {
  id?: string;
  neteaseKeyword?: string;
};

export const MUSIC_COVER_PLACEHOLDER = "/music-cover-placeholder.svg";

export const curatedMusicLibrary: MusicSong[] = [
  song({ title: "晴天", artist: "周杰伦", neteaseSongId: "186016", memoryTypes: ["campus_youth"], scenes: ["教室", "校园", "窗边", "夏天"], visibleObjects: ["课桌", "黑板", "窗户", "阳光"], emotions: ["青春", "遗憾", "夏天"], timeFeelings: ["午后", "夏天"], reason: "适合带有教室、窗边和夏日青春感的画面。" }),
  song({ title: "知足", artist: "五月天", neteaseSongId: "386538", memoryTypes: ["campus_youth"], scenes: ["校园", "操场", "毕业"], visibleObjects: ["操场", "人群", "晚霞"], emotions: ["告别", "青春", "温暖"], timeFeelings: ["傍晚", "毕业季"], reason: "适合毕业、操场和集体告别感。" }),
  song({ title: "遇见", artist: "孙燕姿", memoryTypes: ["campus_youth", "rain_window_solitude"], scenes: ["校园", "窗边", "雨天"], visibleObjects: ["窗户", "雨", "路灯"], emotions: ["期待", "遗憾", "温柔"], timeFeelings: ["雨天", "傍晚"] }),
  song({ title: "耿耿于怀", artist: "王栎鑫", memoryTypes: ["campus_youth"], scenes: ["教室", "校园", "毕业"], visibleObjects: ["课桌", "黑板", "走廊"], emotions: ["未完成感", "青春", "遗憾"], timeFeelings: ["夏天", "毕业季"] }),
  song({ title: "那些年", artist: "胡夏", memoryTypes: ["campus_youth"], scenes: ["教室", "校园", "操场"], visibleObjects: ["课桌", "校服", "阳光"], emotions: ["青春", "告别", "回望"], timeFeelings: ["夏天", "午后"] }),
  song({ title: "蒲公英的约定", artist: "周杰伦", memoryTypes: ["campus_youth"], scenes: ["校园", "窗边", "教室"], visibleObjects: ["钢琴", "课桌", "窗户"], emotions: ["约定", "青春", "怀旧"], timeFeelings: ["午后", "夏天"] }),
  song({ title: "奇妙能力歌", artist: "陈粒", memoryTypes: ["city_park_restorative"], scenes: ["公园", "草地", "散步"], visibleObjects: ["草地", "树", "长椅", "阳光"], emotions: ["自由", "轻盈", "松弛"], timeFeelings: ["午后", "春天"] }),
  song({ title: "云烟成雨", artist: "房东的猫", memoryTypes: ["city_park_restorative", "flower_dream_portrait"], scenes: ["公园", "花园", "草地", "春日"], visibleObjects: ["花", "树", "草地", "阳光"], emotions: ["柔软", "青春", "想念", "温暖"], timeFeelings: ["午后", "春天"], reason: "适合花园、草地、春日柔光里的中文青春感。" }),
  song({ title: "夏日漱石", artist: "橘子海", memoryTypes: ["city_park_restorative", "travel_landscape"], scenes: ["公园", "海边", "夏天"], visibleObjects: ["草地", "天空", "阳光", "海"], emotions: ["夏日", "松弛", "明亮"], timeFeelings: ["夏天", "午后"] }),
  song({ title: "春风十里", artist: "鹿先森乐队", memoryTypes: ["city_park_restorative", "flower_dream_portrait"], scenes: ["公园", "草地", "春日"], visibleObjects: ["树", "风", "阳光"], emotions: ["春日", "告白", "晚风"], timeFeelings: ["春天", "傍晚"] }),
  song({ title: "南方姑娘", artist: "赵雷", memoryTypes: ["city_park_restorative", "travel_landscape"], scenes: ["街道", "公园", "旅途"], visibleObjects: ["路", "树", "风"], emotions: ["温柔", "旧时光", "远方"], timeFeelings: ["傍晚"] }),
  song({ title: "水星记", artist: "郭顶", memoryTypes: ["night_city_dining", "rain_window_solitude"], scenes: ["深夜城市", "窗边", "街道"], visibleObjects: ["灯光", "路灯", "耳机", "玻璃"], emotions: ["孤独", "深夜", "靠近"], timeFeelings: ["深夜", "夜晚"], reason: "适合深夜灯光、玻璃和城市独处感。" }),
  song({ title: "飞行器的执行周期", artist: "郭顶", memoryTypes: ["night_city_dining", "travel_landscape"], scenes: ["城市", "夜路", "车窗"], visibleObjects: ["车窗", "灯光", "建筑"], emotions: ["漂浮", "都市", "失重"], timeFeelings: ["深夜"] }),
  song({ title: "普通朋友", artist: "陶喆", memoryTypes: ["night_city_dining"], scenes: ["餐厅", "夜晚", "城市"], visibleObjects: ["酒杯", "餐桌", "灯光"], emotions: ["克制", "暧昧", "微醺"], timeFeelings: ["夜晚", "深夜"] }),
  song({ title: "好久不见", artist: "陈奕迅", memoryTypes: ["night_city_dining", "rain_window_solitude"], scenes: ["街角", "餐厅", "雨夜"], visibleObjects: ["路灯", "餐桌", "玻璃"], emotions: ["重逢", "遗憾", "深夜"], timeFeelings: ["夜晚", "雨天"] }),
  song({ title: "Under Lover", artist: "落日飞车", memoryTypes: ["night_city_dining"], scenes: ["餐厅", "夜晚", "城市"], visibleObjects: ["酒杯", "灯光", "霓虹"], emotions: ["复古", "暧昧", "微醺"], timeFeelings: ["夜晚"] }),
  song({ title: "滞留锋", artist: "deca joins", memoryTypes: ["night_city_dining", "rain_window_solitude"], scenes: ["雨夜", "街角", "城市"], visibleObjects: ["路灯", "雨", "玻璃"], emotions: ["潮湿", "低落", "城市"], timeFeelings: ["夜晚", "雨天"] }),
  song({ title: "阴天", artist: "莫文蔚", memoryTypes: ["rain_window_solitude"], scenes: ["雨天", "房间", "窗边"], visibleObjects: ["雨", "窗户", "夜灯"], emotions: ["低落", "独处", "灰色"], timeFeelings: ["雨天", "夜晚"] }),
  song({ title: "爱情转移", artist: "陈奕迅", memoryTypes: ["rain_window_solitude", "night_city_dining"], scenes: ["雨夜", "出租车", "街道"], visibleObjects: ["路灯", "车窗", "雨"], emotions: ["迁徙", "遗憾", "城市"], timeFeelings: ["夜晚", "雨天"] }),
  song({ title: "说了再见", artist: "周杰伦", memoryTypes: ["rain_window_solitude", "campus_youth"], scenes: ["窗边", "雨天", "校园"], visibleObjects: ["雨", "窗户", "钢琴"], emotions: ["告别", "雨天", "遗憾"], timeFeelings: ["雨天", "傍晚"] }),
  song({ title: "雨下一整晚", artist: "周杰伦", memoryTypes: ["rain_window_solitude"], scenes: ["雨夜", "窗边", "街道"], visibleObjects: ["雨", "路灯", "水汽"], emotions: ["雨夜", "思念", "古典"], timeFeelings: ["夜晚", "雨天"] }),
  song({ title: "琵琶语", artist: "林海", memoryTypes: ["chinese_garden_water"], scenes: ["园林", "庭院", "水面"], visibleObjects: ["亭台", "水面", "白墙", "瓦片"], emotions: ["留白", "古典", "安静"], timeFeelings: ["清晨", "傍晚"] }),
  song({ title: "风居住的街道", artist: "矶村由纪子", memoryTypes: ["chinese_garden_water", "rain_window_solitude"], scenes: ["雨后", "水面", "街道"], visibleObjects: ["水面", "桥", "雨", "窗户"], emotions: ["清冷", "流动", "怀旧"], timeFeelings: ["雨后", "傍晚"] }),
  song({ title: "繁花", artist: "陈致逸", memoryTypes: ["chinese_garden_water"], scenes: ["庭院", "建筑", "园林"], visibleObjects: ["屋檐", "灯影", "白墙", "水面"], emotions: ["华丽", "东方", "电影感"], timeFeelings: ["夜晚", "黄昏"] }),
  song({ title: "大鱼", artist: "周深", memoryTypes: ["chinese_garden_water", "travel_landscape"], scenes: ["水面", "天空", "湖"], visibleObjects: ["湖", "倒影", "天空", "水面"], emotions: ["梦", "辽阔", "水感"], timeFeelings: ["傍晚", "夜晚"] }),
  song({ title: "旅行的意义", artist: "陈绮贞", memoryTypes: ["flower_dream_portrait", "travel_landscape"], scenes: ["花园", "旅行", "春日"], visibleObjects: ["花", "照片", "阳光"], emotions: ["自由", "柔软", "远方"], timeFeelings: ["午后", "春天"] }),
  song({ title: "小情歌", artist: "苏打绿", memoryTypes: ["flower_dream_portrait", "campus_youth"], scenes: ["花园", "校园", "窗边"], visibleObjects: ["花", "柔光", "窗户"], emotions: ["清新", "喜欢", "青春"], timeFeelings: ["午后", "春天"] }),
  song({ title: "玫瑰少年", artist: "蔡依林", memoryTypes: ["flower_dream_portrait"], scenes: ["花园", "写真", "人像"], visibleObjects: ["玫瑰", "花", "粉色", "人像"], emotions: ["绽放", "勇敢", "柔光"], timeFeelings: ["春天", "午后"] }),
  song({ title: "慢慢喜欢你", artist: "莫文蔚", memoryTypes: ["flower_dream_portrait", "daily_life_home"], scenes: ["花园", "房间", "午后"], visibleObjects: ["花", "桌子", "阳光"], emotions: ["慢", "恋人", "温柔"], timeFeelings: ["午后", "春天"] }),
  song({ title: "想去海边", artist: "夏日入侵企画", memoryTypes: ["flower_dream_portrait", "city_park_restorative", "travel_landscape"], scenes: ["海边", "公园", "夏天"], visibleObjects: ["天空", "阳光", "海"], emotions: ["夏天", "轻盈", "明亮"], timeFeelings: ["夏天", "午后"] }),
  song({ title: "红色高跟鞋", artist: "蔡健雅", memoryTypes: ["flower_dream_portrait", "night_city_dining"], scenes: ["写真", "餐厅", "灯光"], visibleObjects: ["红色", "灯光", "人像"], emotions: ["浪漫", "都市", "复古"], timeFeelings: ["夜晚", "傍晚"] }),
  song({ title: "平凡的一天", artist: "毛不易", memoryTypes: ["daily_life_home", "city_park_restorative"], scenes: ["房间", "日常", "街道"], visibleObjects: ["桌子", "窗户", "阳光"], emotions: ["平静", "生活感", "温暖"], timeFeelings: ["上午", "午后"] }),
  song({ title: "生活倒影", artist: "苏运莹", memoryTypes: ["daily_life_home", "rain_window_solitude"], scenes: ["房间", "窗边", "日常"], visibleObjects: ["窗户", "桌子", "灯"], emotions: ["柔软", "独处", "生活感"], timeFeelings: ["夜晚", "午后"] }),
  song({ title: "Merry Christmas Mr. Lawrence", artist: "Ryuichi Sakamoto", memoryTypes: ["campus_youth", "rain_window_solitude"], scenes: ["窗边", "空房间", "教室"], visibleObjects: ["窗户", "钢琴", "光"], emotions: ["清冷", "回忆", "克制"], timeFeelings: ["冬日", "清晨"] }),
  song({ title: "One Summer's Day", artist: "Joe Hisaishi", memoryTypes: ["city_park_restorative", "flower_dream_portrait", "travel_landscape"], scenes: ["公园", "花园", "天空"], visibleObjects: ["阳光", "树", "天空"], emotions: ["夏天", "梦幻", "童年"], timeFeelings: ["夏天", "午后"] }),
];

export function matchMusicByMemory(result: MoodResult): MusicMemoryRecommendation[] {
  const normalizedContext = normalizeMusicContext(result);
  const routedTypes = routeSpaceMemory(normalizedContext);
  const scored = curatedMusicLibrary
    .map((songItem, index) => {
      const evaluation = scoreSong(songItem, normalizedContext, routedTypes);
      return { ...evaluation, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const recommendations = scored
    .filter((item) => item.score > -5)
    .slice(0, 3)
    .map(({ index: _index, ...item }) => item);

  if (recommendations.length >= 3) return recommendations;

  return fillFallback(recommendations, routedTypes[0] ?? "unknown_soft_memory").slice(0, 3);
}

export const matchMusicByMood = matchMusicByMemory;

export function normalizeMusicContext(result: MoodResult): NormalizedMusicContext {
  const scene = result.scene_observation;
  const allEvidence = [
    scene.primary_scene,
    scene.human_activity,
    scene.lighting,
    scene.color_tone,
    scene.camera_style,
    result.mood_title,
    result.writing,
    result.space_personality,
    ...scene.visible_objects,
    ...scene.atmosphere_evidence,
    ...result.music_keywords,
    ...result.visual_mood_tags,
  ];
  const evidenceText = allEvidence.join(" ").toLowerCase();
  const culturalSignals = CULTURAL_SIGNAL_TRIGGERS.filter((term) =>
    evidenceText.includes(term.toLowerCase()),
  );

  return {
    sceneType: scene.primary_scene,
    visibleObjects: uniqueStrings([...scene.visible_objects, ...scene.atmosphere_evidence]),
    timeFeeling: extractSignals(evidenceText, [
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
      "演唱会",
    ]),
    colorFeeling: extractSignals(evidenceText, [
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
    ]),
    activity: scene.human_activity,
    emotionalTone: uniqueStrings([...result.visual_mood_tags, ...result.music_keywords]),
    culturalSignals,
    forbiddenAssumptions:
      culturalSignals.length > 0 ? [] : ["江南", "古风", "国风", "东方庭院", "中式园林"],
  };
}

function routeSpaceMemory(context: NormalizedMusicContext): SpaceMemoryType[] {
  const evidenceTokens = contextTokens(context);
  const routed = spaceMemoryTaxonomy
    .map((category) => ({
      id: category.id,
      score: weightedOverlap(evidenceTokens, [...category.triggers, ...category.emotions]),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ id }) => id);

  if (!context.culturalSignals.length) {
    return uniqueStrings([
      ...routed.filter((id) => id !== "chinese_garden_water"),
      "unknown_soft_memory",
    ]) as SpaceMemoryType[];
  }

  return routed.length ? routed : ["unknown_soft_memory"];
}

function scoreSong(
  songItem: MusicSong,
  context: NormalizedMusicContext,
  routedTypes: SpaceMemoryType[],
): MusicMemoryRecommendation {
  const sceneMatch = countMatches([context.sceneType, ...routedTypes], [
    ...songItem.scenes,
    ...songItem.memoryTypes,
  ]);
  const visibleObjectMatch = countMatches(context.visibleObjects, songItem.visibleObjects);
  const emotionMatch = countMatches(context.emotionalTone, songItem.emotions);
  const timeFeelingMatch = countMatches(context.timeFeeling, songItem.timeFeelings);
  const culturalSignalMatch = countMatches(context.culturalSignals, [
    ...songItem.scenes,
    ...songItem.visibleObjects,
  ]);
  const forbiddenMismatch = countForbiddenMismatch(context, songItem);
  const score =
    sceneMatch * 4 +
    visibleObjectMatch * 3 +
    emotionMatch * 2 +
    timeFeelingMatch * 1.5 +
    culturalSignalMatch * 2 -
    forbiddenMismatch * 5;
  const matchedSignals = uniqueStrings([
    ...matchLabels([context.sceneType, ...routedTypes], [
      ...songItem.scenes,
      ...songItem.memoryTypes,
    ]),
    ...matchLabels(context.visibleObjects, songItem.visibleObjects),
    ...matchLabels(context.emotionalTone, songItem.emotions),
    ...matchLabels(context.timeFeeling, songItem.timeFeelings),
  ]).slice(0, 5);

  return {
    song: songItem,
    score,
    reason: createReason(songItem, context, matchedSignals),
    matchedSignals,
  };
}

function countForbiddenMismatch(context: NormalizedMusicContext, songItem: MusicSong) {
  if (
    context.forbiddenAssumptions.length > 0 &&
    songItem.memoryTypes.includes("chinese_garden_water")
  ) {
    return 1;
  }

  const contextText = contextTokens(context).join(" ");
  if (
    songItem.memoryTypes.includes("flower_dream_portrait") &&
    /餐厅|酒杯|霓虹|深夜/.test(contextText)
  ) {
    return 1;
  }

  if (
    songItem.memoryTypes.includes("night_city_dining") &&
    /教室|黑板|课桌|校园/.test(contextText)
  ) {
    return 1;
  }

  return 0;
}

function createReason(
  songItem: MusicSong,
  context: NormalizedMusicContext,
  matchedSignals: string[],
) {
  if (songItem.reason) return songItem.reason;

  const signals = matchedSignals.length
    ? matchedSignals.slice(0, 3).join("、")
    : context.sceneType || "这段空间";
  const emotion = songItem.emotions.slice(0, 2).join("、");

  return `这首歌更适合画面里的${signals}，把${emotion}的情绪继续往后放了一点。`;
}

function fillFallback(
  current: MusicMemoryRecommendation[],
  type: SpaceMemoryType,
) {
  const fallbackType = type === "unknown_soft_memory" ? "daily_life_home" : type;
  const existing = new Set(current.map((item) => item.song.id));
  const fallbackSongs = curatedMusicLibrary
    .filter((item) => item.memoryTypes.includes(fallbackType) && !existing.has(item.id))
    .slice(0, 3 - current.length)
    .map((songItem) => ({
      song: songItem,
      score: 0,
      reason: songItem.reason ?? "这首歌是比较安全的中文情绪记忆，不会把画面推向没有证据的文化联想。",
      matchedSignals: songItem.emotions.slice(0, 2),
    }));

  if (fallbackSongs.length) return [...current, ...fallbackSongs];

  return [
    ...current,
    ...curatedMusicLibrary.slice(0, 3 - current.length).map((songItem) => ({
      song: songItem,
      score: 0,
      reason: songItem.reason ?? "这首歌保留了中文空间记忆里柔和、克制的一面。",
      matchedSignals: songItem.emotions.slice(0, 2),
    })),
  ];
}

function song(input: SongInput): MusicSong {
  return {
    ...input,
    id: input.id ?? slugify(`${input.title}-${input.artist}`),
    neteaseKeyword: input.neteaseKeyword ?? `${input.title} ${input.artist}`,
  };
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

function weightedOverlap(source: string[], target: string[]) {
  let score = 0;
  const targetTokens = target.flatMap(tokenize);

  for (const sourceToken of source.flatMap(tokenize)) {
    for (const targetToken of targetTokens) {
      if (sourceToken === targetToken) score += 3;
      else if (fuzzyMatch(sourceToken, targetToken)) score += 1;
    }
  }

  return score;
}

function fuzzyMatch(a: string, b: string) {
  return a === b || a.includes(b) || b.includes(a);
}

function extractSignals(text: string, signals: string[]) {
  return signals.filter((signal) => text.includes(signal.toLowerCase()));
}

function uniqueStrings(values: Array<string | undefined>) {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function tokenize(value: string) {
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

export function getNeteaseUrl(songItem: MusicSong) {
  if (songItem.neteaseSongId) {
    return `https://music.163.com/#/song?id=${songItem.neteaseSongId}`;
  }

  return `https://music.163.com/#/search/m/?s=${encodeURIComponent(songItem.neteaseKeyword)}&type=1`;
}
