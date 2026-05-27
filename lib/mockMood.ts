import type { MoodDebugSource, MoodResult } from "@/lib/mood-schema";

export const mockMoodResult: MoodResult = {
  scene_observation: {
    primary_scene: "classroom",
    visible_objects: ["windows", "desks", "chairs", "chalkboard"],
    human_activity: "no visible active movement; the room feels recently emptied",
    lighting: "late afternoon window light",
    color_tone: "warm dust tones with cool blue shadows",
    camera_style: "still observational interior frame",
    atmosphere_evidence: [
      "empty desks",
      "soft angled light",
      "quiet classroom arrangement",
    ],
  },
  mood_title: "最后一课",
  mood_subtitle: "光停在课桌上，像一句没说完的话。",
  time_label: "午后",
  space_memory_text:
    "教室已经安静下来。窗边的光落在桌椅之间，空气里还有一点刚散场的停顿，像某个普通下午被轻轻夹进了回忆里。",
  writing:
    "教室已经安静下来。窗边的光落在桌椅之间，空气里还有一点刚散场的停顿，像某个普通下午被轻轻夹进了回忆里。",
  space_personality:
    "像一个安静保存光线和告别的地方。",
  visual_tone: ["窗边柔光", "旧课桌", "安静空气", "蓝色阴影"],
  music_query: "校园 午后 青春 回忆 民谣",
  music_keywords: ["校园", "午后", "青春", "回忆", "民谣"],
  music_memories: [
    {
      title: "晴天",
      artist: "周杰伦",
      reason: "像风吹过旧教室。",
      mood: "校园回忆",
    },
    {
      title: "知足",
      artist: "五月天",
      reason: "适合放学后的安静。",
      mood: "温柔告别",
    },
    {
      title: "那些年",
      artist: "胡夏",
      reason: "有一种夏天结束前的停顿。",
      mood: "青春",
    },
  ],
  music_recommendations: [
    {
      title: "晴天",
      artist: "周杰伦",
      reason: "像风吹过旧教室。",
      mood: "校园回忆",
    },
    {
      title: "知足",
      artist: "五月天",
      reason: "适合放学后的安静。",
      mood: "温柔告别",
    },
    {
      title: "那些年",
      artist: "胡夏",
      reason: "有一种夏天结束前的停顿。",
      mood: "青春",
    },
  ],
  share_card_text: "光停在课桌之间，像那天还没有真正结束。",
  visual_mood_tags: ["窗边柔光", "旧课桌", "安静空气", "蓝色阴影"],
  debug_source: "mock_no_key",
};

export function createMockMoodResult(debug_source: MoodDebugSource): MoodResult {
  return {
    ...mockMoodResult,
    debug_source,
  };
}
