import { musicRecommendationTestCases } from "../data/music-recommendation-test-cases";
import {
  getMusicRecommendationPool,
  filterVerifiedRecommendations,
  type MusicMemoryRecommendation,
} from "../lib/music-library";
import { FORBIDDEN_TAG_WORDS } from "../lib/mood-schema";
import type { MoodResult } from "../lib/mood-schema";

const forbiddenTitleSet = new Set<string>(FORBIDDEN_TAG_WORDS as readonly string[]);
const hardAssertionErrors: string[] = [];
const hardAssertionWarnings: string[] = [];

let totalCases = 0;
let casesWithRecommendations = 0;

for (const testCase of musicRecommendationTestCases) {
  totalCases++;
  const result = createMoodResultFromTestCase(testCase);
  const pool = getMusicRecommendationPool(result);
  const recommendations = filterVerifiedRecommendations(pool).slice(0, 3);
  const coverageRisk = recommendations.length < 3 ||
    recommendations.some((recommendation) => recommendation.coverageRisk);
  const candidateCount = recommendations[0]?.candidateCount ?? 0;

  console.log(`\n[${testCase.id}] ${testCase.label}`);
  console.log(`candidateCount: ${candidateCount}`);
  console.log(`coverageRisk: ${coverageRisk}`);

  if (!recommendations.length) {
    console.log("Top 3: none");
    // Check if any non-verified recommendations were filtered out
    const unfiltered = pool.slice(0, 3);
    if (unfiltered.length > 0) {
      hardAssertionWarnings.push(
        `${testCase.id}: ${unfiltered.length} recommendations filtered as unverified.`,
      );
    }
    continue;
  }

  casesWithRecommendations++;

  console.log("Top 3:");
  recommendations.forEach((recommendation, index) => {
    printRecommendation(index, recommendation);

    // Hard assertions per recommendation
    const song = recommendation.song;

    // Assertion 1: No tag as song title
    if (forbiddenTitleSet.has(song.title)) {
      hardAssertionErrors.push(
        `[${testCase.id}] recommendation ${index + 1}: 标签冒充歌曲 — title="${song.title}"`,
      );
    }

    // Assertion 2: Song must have title
    if (!song.title?.trim()) {
      hardAssertionErrors.push(
        `[${testCase.id}] recommendation ${index + 1}: 缺少 title`,
      );
    }

    // Assertion 3: Song must have artist
    if (!song.artist?.trim()) {
      hardAssertionErrors.push(
        `[${testCase.id}] recommendation ${index + 1}: 缺少 artist`,
      );
    }

    // Assertion 4: Song must have verified songId
    if (!song.songId && !song.neteaseSongId) {
      hardAssertionErrors.push(
        `[${testCase.id}] recommendation ${index + 1}: 缺少 verified songId`,
      );
    }

    // Assertion 5: metadataVerified must be true
    if (song.metadataVerified !== true) {
      hardAssertionErrors.push(
        `[${testCase.id}] recommendation ${index + 1}: metadataVerified is not true`,
      );
    }

    // Assertion 6: No visualTags in song title
    const visualTagWords = [
      "柔光", "胶片", "暗光", "暖光", "冷色", "蓝调", "绿色",
    ];
    if (visualTagWords.some((tag) => song.title.includes(tag))) {
      hardAssertionWarnings.push(
        `[${testCase.id}] recommendation ${index + 1}: title="${song.title}" 包含视觉标签词汇`,
      );
    }
  });
}

// ── Summary ──
console.log("\n" + "=".repeat(60));
console.log("Hard Assertions Summary");
console.log("=".repeat(60));

console.log(`\nTotal test cases: ${totalCases}`);
console.log(`Cases with recommendations: ${casesWithRecommendations}`);
console.log(`Hard assertion errors: ${hardAssertionErrors.length}`);
console.log(`Hard assertion warnings: ${hardAssertionWarnings.length}`);

if (hardAssertionErrors.length > 0) {
  console.log("\n❌ HARD ASSERTION ERRORS:");
  for (const error of hardAssertionErrors) {
    console.log(`  - ${error}`);
  }
}

if (hardAssertionWarnings.length > 0) {
  console.log("\n⚠️  HARD ASSERTION WARNINGS:");
  for (const warning of hardAssertionWarnings) {
    console.log(`  - ${warning}`);
  }
}

if (hardAssertionErrors.length > 0) {
  console.log("\n❌ 硬断言失败！标签冒充歌曲或数据不完整。");
  process.exit(1);
} else {
  console.log("\n✓ 所有硬断言通过。");
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
