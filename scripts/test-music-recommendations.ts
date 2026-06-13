import { musicRecommendationTestCases } from "../data/music-recommendation-test-cases";
import {
  getMusicRecommendationPool,
  type MusicMemoryRecommendation,
} from "../lib/music-library";
import type { MoodResult } from "../lib/mood-schema";

for (const testCase of musicRecommendationTestCases) {
  const result = createMoodResultFromTestCase(testCase);
  const recommendations = getMusicRecommendationPool(result).slice(0, 3);
  const coverageRisk = recommendations.length < 3 ||
    recommendations.some((recommendation) => recommendation.coverageRisk);
  const candidateCount = recommendations[0]?.candidateCount ?? 0;

  console.log(`\n[${testCase.id}] ${testCase.label}`);
  console.log(`candidateCount: ${candidateCount}`);
  console.log(`coverageRisk: ${coverageRisk}`);

  if (!recommendations.length) {
    console.log("Top 3: none");
    continue;
  }

  console.log("Top 3:");
  recommendations.forEach((recommendation, index) => {
    printRecommendation(index, recommendation);
  });
}

function createMoodResultFromTestCase(
  testCase: (typeof musicRecommendationTestCases)[number],
): MoodResult {
  const tags = testCase.inputTags;
  const text = [
    testCase.label,
    ...tags.spaceTags,
    ...tags.sceneTags,
    ...(tags.cityTags ?? []),
    ...(tags.timeTags ?? []),
    ...(tags.socialContextTags ?? []),
    ...(tags.memoryTags ?? []),
    ...(tags.visualTags ?? []),
    ...(tags.cultureTags ?? []),
    ...(tags.musicSceneTags ?? []),
    ...(tags.atmosphereTags ?? []),
    ...(tags.emotionTags ?? []),
  ].join(" ");

  return {
    scene_observation: {
      primary_scene: [testCase.label, ...tags.sceneTags].join(" "),
      visible_objects: [
        ...tags.sceneTags,
        ...(tags.visualTags ?? []),
        ...(tags.cityTags ?? []),
      ],
      human_activity: (tags.socialContextTags ?? []).join(" "),
      lighting: (tags.timeTags ?? []).join(" "),
      color_tone: (tags.visualTags ?? []).join(" "),
      camera_style: "",
      atmosphere_evidence: [
        ...tags.sceneTags,
        ...(tags.visualTags ?? []),
      ],
    },
    spaceTags: tags.spaceTags,
    sceneTags: tags.sceneTags,
    emotionTags: tags.emotionTags ?? [],
    memoryTags: tags.memoryTags ?? [],
    visualTags: tags.visualTags ?? [],
    seasonTags: [],
    mood_title: testCase.label,
    mood_subtitle: text,
    time_label: (tags.timeTags ?? ["此刻"]).join(" "),
    writing: text,
    space_memory_text: text,
    space_personality: text,
    visual_tone: tags.visualTags ?? [],
    music_query: text,
    music_keywords: text.split(/\s+/).filter(Boolean),
    music_memories: [],
    music_recommendations: [],
    share_card_text: text,
    visual_mood_tags: tags.visualTags ?? [],
    debug_source: "qwen_normalized",
  };
}

function printRecommendation(
  index: number,
  recommendation: MusicMemoryRecommendation,
) {
  const song = recommendation.song;
  const sceneConflict = hasSceneConflict(recommendation);
  const timeConflict = hasConflict(song.timeTags, recommendation.matchedSignals);
  const socialContextConflict = hasConflict(
    song.socialContextTags,
    recommendation.matchedSignals,
  );

  console.log(
    `${index + 1}. ${song.title} - ${song.artist} - ${
      song.songId || song.neteaseSongId
    }`,
  );
  console.log(`   metadataVerified: ${song.metadataVerified}`);
  console.log(`   score: ${recommendation.score}`);
  console.log(`   scoreBreakdown: ${JSON.stringify(recommendation.matchedTagBreakdown ?? {})}`);
  console.log(`   matchedEvidence: ${JSON.stringify(recommendation.matchedEvidence ?? {})}`);
  console.log(`   scene conflict: ${sceneConflict}`);
  console.log(`   time conflict: ${timeConflict}`);
  console.log(`   social context conflict: ${socialContextConflict}`);
}

function hasSceneConflict(recommendation: MusicMemoryRecommendation) {
  const evidenceScenes = new Set(recommendation.matchedEvidence?.scene ?? []);

  if (!evidenceScenes.size) return false;

  return !recommendation.song.usageScenes.some((scene) => evidenceScenes.has(scene));
}

function hasConflict(source: string[], matchedSignals: string[]) {
  if (!source.length || !matchedSignals.length) return false;
  return false;
}
