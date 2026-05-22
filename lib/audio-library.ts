import type { MoodResult } from "@/lib/mood-schema";
import type { MusicMemoryMatch } from "@/lib/music-matcher";

export type AtmosphereAudioTrack = {
  id: string;
  title: string;
  file: string;
  moods: string[];
  scenes: string[];
  music_keywords: string[];
  time_feelings: string[];
};

export const atmosphereAudioLibrary: AtmosphereAudioTrack[] = [
  {
    id: "after-midnight",
    title: "After Midnight",
    file: "/audio/after-midnight.mp3",
    moods: ["深夜", "孤独", "失眠", "blue", "quiet"],
    scenes: ["窗边", "房间", "夜街", "城市"],
    music_keywords: ["ambient", "slow", "midnight", "night"],
    time_feelings: ["midnight", "凌晨", "深夜"],
  },
  {
    id: "city-park-breathing",
    title: "City Park Breathing",
    file: "/audio/city-park-breathing.mp3",
    moods: ["呼吸", "绿色", "恢复", "轻盈"],
    scenes: ["公园", "树", "草地", "花园"],
    music_keywords: ["park", "breathing", "ambient", "moss"],
    time_feelings: ["afternoon", "午后", "傍晚"],
  },
  {
    id: "jiangnan-morning",
    title: "Jiangnan Morning",
    file: "/audio/jiangnan-morning.mp3",
    moods: ["江南", "清晨", "水气", "温柔"],
    scenes: ["江南", "庭院", "天井", "水边", "屋檐"],
    music_keywords: ["国风", "古琴", "笛", "jiangnan", "morning"],
    time_feelings: ["morning", "清晨", "雨后"],
  },
  {
    id: "last-classroom",
    title: "Last Classroom",
    file: "/audio/last-classroom.mp3",
    moods: ["毕业", "怀旧", "空教室", "告别"],
    scenes: ["教室", "校园", "课桌", "走廊", "classroom"],
    music_keywords: ["校园", "毕业", "piano", "bell", "青春"],
    time_feelings: ["傍晚", "5:12", "毕业季", "afternoon"],
  },
  {
    id: "midnight-restaurant",
    title: "Midnight Restaurant",
    file: "/audio/midnight-restaurant.mp3",
    moods: ["餐桌", "暖灯", "深夜", "亲密"],
    scenes: ["餐桌", "餐厅", "厨房", "晚餐", "restaurant"],
    music_keywords: ["jazz", "table", "dinner", "old film"],
    time_feelings: ["night", "深夜", "晚饭后"],
  },
  {
    id: "night-walk-radio",
    title: "Night Walk Radio",
    file: "/audio/night-walk-radio.mp3",
    moods: ["行走", "城市", "电台", "霓虹"],
    scenes: ["街道", "街角", "车窗", "夜路"],
    music_keywords: ["radio", "walk", "city pop", "night"],
    time_feelings: ["night", "凌晨", "路上"],
  },
  {
    id: "rain-window",
    title: "Rain Window",
    file: "/audio/rain-window.mp3",
    moods: ["雨", "潮湿", "安静", "思念"],
    scenes: ["窗边", "雨后街角", "玻璃", "街道"],
    music_keywords: ["rain", "window", "ambient", "piano"],
    time_feelings: ["雨夜", "雨后", "夜晚"],
  },
  {
    id: "restorative-garden",
    title: "Restorative Garden",
    file: "/audio/restorative-garden.mp3",
    moods: ["治愈", "植物", "安静", "呼吸"],
    scenes: ["花园", "庭院", "植物", "公园"],
    music_keywords: ["garden", "restorative", "ambient", "nature"],
    time_feelings: ["午后", "清晨", "spring"],
  },
  {
    id: "spring-courtyard",
    title: "Spring Courtyard",
    file: "/audio/spring-courtyard.mp3",
    moods: ["春日", "花影", "天井", "温柔"],
    scenes: ["天井", "庭院", "花园", "旧墙"],
    music_keywords: ["spring", "courtyard", "江南", "民谣"],
    time_feelings: ["春天", "午后", "afternoon"],
  },
  {
    id: "summer-memory",
    title: "Summer Memory",
    file: "/audio/summer-memory.mp3",
    moods: ["夏日", "青春", "明亮", "旧照片"],
    scenes: ["校园", "窗边", "街道", "房间"],
    music_keywords: ["summer", "memory", "kpop", "city pop", "青春"],
    time_feelings: ["夏天", "下午", "周末"],
  },
];

export function matchAtmosphereAudio(
  result: MoodResult,
  recommendation?: MusicMemoryMatch,
) {
  const query = buildAudioQuery(result, recommendation);

  return atmosphereAudioLibrary
    .map((track, index) => ({
      track,
      index,
      score: scoreTrack(track, query),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0].track;
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
    track.title,
    track.id,
    ...track.moods,
    ...track.scenes,
    ...track.music_keywords,
    ...track.time_feelings,
  ].flatMap(tokenize);

  let score = 0;

  for (const queryToken of query) {
    for (const trackToken of haystack) {
      if (queryToken === trackToken) score += 5;
      else if (queryToken.includes(trackToken) || trackToken.includes(queryToken)) {
        score += 2;
      }
    }
  }

  return score;
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[\s,，.。/、:：;；|·-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}
