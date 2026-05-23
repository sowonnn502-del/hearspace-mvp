import type { MoodResult } from "@/lib/mood-schema";
import type { MusicMemoryMatch } from "@/lib/music-matcher";

export type AtmosphereAudioTrack = {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  cover: string;
  scenes: string[];
  moods: string[];
  keywords: string[];
  tags: string[];
  reason: string;
};

export const atmosphereAudioLibrary: AtmosphereAudioTrack[] = [
  {
    id: "after-midnight",
    title: "午夜以后",
    subtitle: "after midnight tape",
    file: "/audio/after-midnight.mp3",
    cover: "/feed/midnight-restaurant.png",
    scenes: ["窗边", "房间", "夜街", "城市", "卧室", "深夜"],
    moods: ["安静", "孤独", "失眠", "夜色", "冷光"],
    keywords: ["after", "midnight", "night", "ambient", "quiet", "room"],
    tags: ["深夜", "冷光", "慢速"],
    reason: "适合夜色、窗边、低照度和独处感明显的空间。",
  },
  {
    id: "city-park-breathing",
    title: "城市在呼吸",
    subtitle: "city park breathing tape",
    file: "/audio/city-park-breathing.mp3",
    cover: "/feed/city-park-breathing.png",
    scenes: ["公园", "草地", "树", "树影", "长椅", "城市", "晨光"],
    moods: ["恢复", "呼吸", "柔和", "绿色", "清晨"],
    keywords: ["park", "breathing", "city", "green", "ambient", "morning"],
    tags: ["公园", "晨光", "恢复"],
    reason: "适合有树影、公园、晨光和城市喘息感的空间记忆。",
  },
  {
    id: "jiangnan-morning",
    title: "水气清晨",
    subtitle: "jiangnan morning tape",
    file: "/audio/jiangnan-morning.mp3",
    cover: "/feed/spring-courtyard.png",
    scenes: ["水边", "屋檐", "中式建筑", "古典园林", "庭院", "天井", "江南"],
    moods: ["清晨", "水气", "柔和", "安静", "留白"],
    keywords: ["jiangnan", "morning", "water", "courtyard", "garden", "soft"],
    tags: ["水气", "清晨", "屋檐"],
    reason: "只适合画面中明确出现水边、屋檐、中式建筑或古典园林线索的空间。",
  },
  {
    id: "last-classroom",
    title: "最后一课",
    subtitle: "last classroom tape",
    file: "/audio/last-classroom.mp3",
    cover: "/feed/last-classroom.png",
    scenes: ["教室", "校园", "课桌", "椅子", "黑板", "走廊", "classroom"],
    moods: ["毕业", "怀旧", "告别", "青春", "空旷"],
    keywords: ["classroom", "school", "piano", "bell", "youth", "memory"],
    tags: ["教室", "毕业", "斜阳"],
    reason: "适合教室、课桌、走廊、黄昏光线和告别感明显的空间。",
  },
  {
    id: "midnight-restaurant",
    title: "夜晚餐桌",
    subtitle: "midnight restaurant tape",
    file: "/audio/midnight-restaurant.mp3",
    cover: "/feed/midnight-restaurant.png",
    scenes: ["餐桌", "餐厅", "厨房", "晚餐", "酒杯", "暖灯", "restaurant"],
    moods: ["亲密", "微醺", "温暖", "深夜", "电影感"],
    keywords: ["restaurant", "dinner", "table", "jazz", "warm", "night"],
    tags: ["餐桌", "暖灯", "夜晚"],
    reason: "适合餐桌、暖色灯光、多人聚餐或夜晚电影感的空间记忆。",
  },
  {
    id: "night-walk-radio",
    title: "夜路电台",
    subtitle: "night walk radio tape",
    file: "/audio/night-walk-radio.mp3",
    cover: "/feed/midnight-restaurant.png",
    scenes: ["街道", "街角", "车窗", "夜路", "霓虹", "城市", "street"],
    moods: ["行走", "电台", "夜色", "潮湿", "城市"],
    keywords: ["radio", "walk", "street", "city", "night", "neon"],
    tags: ["夜路", "电台", "城市"],
    reason: "适合街道、霓虹、车窗、夜行和城市流动感明显的画面。",
  },
  {
    id: "rain-window",
    title: "雨窗",
    subtitle: "rain window tape",
    file: "/audio/rain-window.mp3",
    cover: "/feed/city-park-breathing.png",
    scenes: ["窗边", "玻璃", "雨", "雨后", "街道", "水痕", "window"],
    moods: ["潮湿", "安静", "思念", "灰蓝", "雨夜"],
    keywords: ["rain", "window", "wet", "ambient", "piano", "quiet"],
    tags: ["雨", "窗边", "灰蓝"],
    reason: "适合雨水、玻璃、水痕、窗边和潮湿光线构成的空间。",
  },
  {
    id: "restorative-garden",
    title: "恢复性花园",
    subtitle: "restorative garden tape",
    file: "/audio/restorative-garden.mp3",
    cover: "/feed/city-park-breathing.png",
    scenes: ["花园", "植物", "庭院", "公园", "阳台", "树影", "garden"],
    moods: ["治愈", "安静", "呼吸", "柔和", "自然"],
    keywords: ["garden", "restorative", "ambient", "nature", "soft", "green"],
    tags: ["植物", "呼吸", "安静"],
    reason: "适合植物、树影、花园和低饱和自然光里的恢复性空间。",
  },
  {
    id: "spring-courtyard",
    title: "檐下风铃",
    subtitle: "spring courtyard tape",
    file: "/audio/spring-courtyard.mp3",
    cover: "/feed/spring-courtyard.png",
    scenes: ["庭院", "花园", "天井", "春日", "树影", "花影", "旧墙"],
    moods: ["安静", "柔和", "春日", "记忆", "午后"],
    keywords: ["garden", "spring", "ambient", "soft", "nature", "courtyard"],
    tags: ["春日", "庭院", "风铃"],
    reason: "适合带有花园、树影和午后光线的空间记忆。",
  },
  {
    id: "summer-memory",
    title: "夏日旧相片",
    subtitle: "summer memory tape",
    file: "/audio/summer-memory.mp3",
    cover: "/feed/last-classroom.png",
    scenes: ["房间", "窗边", "街道", "校园", "阳光", "夏天"],
    moods: ["明亮", "青春", "旧照片", "夏日", "轻盈"],
    keywords: ["summer", "memory", "bright", "youth", "city", "afternoon"],
    tags: ["夏日", "旧照片", "明亮"],
    reason: "适合明亮日光、夏日色温、窗边和青春感较强的画面。",
  },
];

export function getAtmosphereAudioById(id: string) {
  return (
    atmosphereAudioLibrary.find((track) => track.id === id) ??
    getDefaultAtmosphereAudio()
  );
}

export function getDefaultAtmosphereAudio() {
  return atmosphereAudioLibrary.find((track) => track.id === "restorative-garden")!;
}

export function matchAtmosphereAudio(
  result: MoodResult,
  recommendation?: MusicMemoryMatch,
) {
  const query = buildAudioQuery(result, recommendation);
  const scored = atmosphereAudioLibrary
    .map((track, index) => ({
      track,
      index,
      score: scoreTrack(track, query),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const best = scored[0];
  if (!best || best.score < 4) return getDefaultAtmosphereAudio();

  return best.track;
}

function buildAudioQuery(
  result: MoodResult,
  recommendation?: MusicMemoryMatch,
) {
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
    recommendation?.title,
    recommendation?.artist,
    recommendation?.source,
    recommendation?.mood,
    recommendation?.reason,
    ...(recommendation?.keywords ?? []),
    ...(recommendation?.scene_tags ?? []),
  ].flatMap((value) => tokenize(value ?? ""));
}

function scoreTrack(track: AtmosphereAudioTrack, query: string[]) {
  const haystack = [
    track.id,
    track.title,
    track.subtitle,
    track.reason,
    ...track.scenes,
    ...track.moods,
    ...track.keywords,
    ...track.tags,
  ].flatMap(tokenize);

  let score = 0;

  for (const queryToken of query) {
    for (const trackToken of haystack) {
      if (queryToken === trackToken) score += 6;
      else if (queryToken.includes(trackToken) || trackToken.includes(queryToken)) {
        score += 2;
      }
    }
  }

  return score;
}

function tokenize(value: string) {
  const normalized = value.toLowerCase();
  const wordTokens = normalized
    .split(/[\s,，.。/、:：;；|·()[\]{}"'!?！?_-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
  const cjkTokens = Array.from(normalized.matchAll(/[\u4e00-\u9fff]{2,}/g)).map(
    ([token]) => token,
  );

  return Array.from(new Set([...wordTokens, ...cjkTokens]));
}
