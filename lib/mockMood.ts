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
  mood_title: "The Last Class",
  time_label: "Late afternoon, 5:12 PM",
  writing: "Some classrooms never say goodbye. They keep the chalk dust, the slant of window light, and the soft pause after everyone has gone.",
  space_personality:
    "A reflective, tender space with a quiet memory. It feels like someone who saves small goodbyes in the corners and lets the light speak first.",
  music_keywords: ["soft piano", "tape warmth", "distant bell", "slow ambient"],
  music_recommendations: [
    {
      title: "soft piano",
      reason: "A quiet piano direction keeps the room's late light and unfinished silence close.",
      mood: "quiet memory",
    },
    {
      title: "tape warmth",
      reason: "A little analog haze suits the classroom's stored afternoon feeling.",
      mood: "film nostalgia",
    },
    {
      title: "slow ambient",
      reason: "Slow ambient leaves enough empty space for the scene to breathe.",
      mood: "soft pause",
    },
  ],
  visual_mood_tags: ["window light", "warm dust", "empty seats", "blue shadow"],
  debug_source: "mock_no_key",
};

export function createMockMoodResult(debug_source: MoodDebugSource): MoodResult {
  return {
    ...mockMoodResult,
    debug_source,
  };
}
