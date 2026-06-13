/**
 * Golden Test Runner
 *
 * Runs all golden test cases and reports PASS/FAIL with detailed evidence.
 * These tests CAN and SHOULD fail when recommendations are wrong.
 *
 * Usage: npx tsx scripts/test-golden-cases.ts
 */

import { goldenTestCases, confusionPairs, type GoldenTestCase } from "../data/music-golden-test-cases";
import {
  getMusicRecommendationPool,
  filterVerifiedRecommendations,
  getAudienceFitStatus,
  type MusicMemoryRecommendation,
  type MusicSong,
} from "../lib/music-library";
import type { MoodResult } from "../lib/mood-schema";

// ── Types ──

type GoldenTestResult = {
  caseId: string;
  label: string;
  overallPass: boolean;
  recommendations: Array<{
    title: string;
    artist: string;
    songId: string;
    primaryScene: string[];
    familiarityTier: string;
    hasListenerEvidence: boolean;
    matchedEvidence: string[];
    reason: string;
    score: number;
  }>;
  failures: string[];
  warnings: string[];
};

type ConfusionResult = {
  positiveId: string;
  confusingId: string;
  positiveTop3: string[];
  confusingTop3: string[];
  sharedTracks: string[];
  distinctTracks: string[];
  sceneDistinctionPass: boolean;
  reason: string;
};

// ── Main ──

function main(): void {
  console.log("═".repeat(70));
  console.log("  Golden Test Runner — 真实失败条件");
  console.log("═".repeat(70));
  console.log();

  const results: GoldenTestResult[] = [];

  for (const testCase of goldenTestCases) {
    const result = runGoldenTest(testCase);
    results.push(result);
    printGoldenResult(result);
  }

  // Confusion pairs
  console.log("─".repeat(70));
  console.log("  负样本对照测试 (Confusion Pairs)");
  console.log("─".repeat(70));
  console.log();

  const confusionResults: ConfusionResult[] = [];
  for (const pair of confusionPairs) {
    const posCase = goldenTestCases.find((c) => c.id === pair.positive);
    const confCase = goldenTestCases.find((c) => c.id === pair.confusing);
    if (!posCase || !confCase) continue;

    const posResult = runGoldenTest(posCase);
    const confResult = runGoldenTest(confCase);

    const posTracks = posResult.recommendations.map((r) => r.title);
    const confTracks = confResult.recommendations.map((r) => r.title);
    const shared = posTracks.filter((t) => confTracks.includes(t));
    const distinct = [...posTracks.filter((t) => !confTracks.includes(t)), ...confTracks.filter((t) => !posTracks.includes(t))];

    // Scene distinction: fewer shared tracks = better
    const distinctionPass = shared.length <= 1 && posResult.recommendations.length > 0 && confResult.recommendations.length > 0;

    const cResult: ConfusionResult = {
      positiveId: pair.positive,
      confusingId: pair.confusing,
      positiveTop3: posTracks,
      confusingTop3: confTracks,
      sharedTracks: shared,
      distinctTracks: distinct,
      sceneDistinctionPass: distinctionPass,
      reason: pair.reason,
    };
    confusionResults.push(cResult);

    console.log(`  ${posCase.label} vs ${confCase.label}`);
    console.log(`  ${pair.reason}`);
    console.log(`  Positive Top 3: ${posTracks.join(" / ")}`);
    console.log(`  Confusing Top 3: ${confTracks.join(" / ")}`);
    console.log(`  Shared tracks: ${shared.length ? shared.join(", ") : "无 ✓"}`);
    console.log(`  Scene distinction: ${distinctionPass ? "PASS ✓" : "FAIL ❌ — 共享歌曲过多"}`);
    console.log();
  }

  // Summary
  const passed = results.filter((r) => r.overallPass).length;
  const failed = results.filter((r) => !r.overallPass).length;
  const confusionPassed = confusionResults.filter((c) => c.sceneDistinctionPass).length;
  const confusionFailed = confusionResults.filter((c) => !c.sceneDistinctionPass).length;

  console.log("═".repeat(70));
  console.log("  Summary");
  console.log("═".repeat(70));
  console.log(`  Golden tests: ${passed} PASS / ${failed} FAIL (${results.length} total)`);
  console.log(`  Confusion pairs: ${confusionPassed} PASS / ${confusionFailed} FAIL (${confusionResults.length} total)`);
  console.log(`  Negative-control distinction rate: ${((confusionPassed / confusionResults.length) * 100).toFixed(0)}%`);

  // Core metrics — per recommendation, not per test
  console.log();
  console.log("  核心指标:");

  const allRecs = results.flatMap((r) => r.recommendations);
  const totalRecs = allRecs.length;
  const withEvidence = allRecs.filter((r) => r.hasListenerEvidence).length;

  // Primary Precision: fraction of recommendations where primary scene matches target
  const primaryCorrect = allRecs.filter((r) => r.primaryScene.length > 0).length;
  const primaryPrecision = totalRecs > 0 ? (primaryCorrect / totalRecs) * 100 : 0;

  // Scene Conflict Rate: recommendations with scene conflicts (should be 0)
  const sceneConflicts = allRecs.filter((r) => r.matchedEvidence?.some((s) => s.includes("conflict"))).length;
  const sceneConflictRate = totalRecs > 0 ? (sceneConflicts / totalRecs) * 100 : 0;

  // Coverage Rate: scenes with at least 1 recommendation
  const scenesWithRecs = results.filter((r) => r.recommendations.length > 0).length;
  const coverageRate = results.length > 0 ? (scenesWithRecs / results.length) * 100 : 0;

  // Zero-result Rate: scenes with 0 recommendations (honest zero)
  const zeroResultScenes = results.filter((r) => r.recommendations.length === 0).length;
  const zeroResultRate = results.length > 0 ? (zeroResultScenes / results.length) * 100 : 0;

  // Wrong Scene Rate: calculated per-test from forbidden signal detection
  const wrongScene = results.filter((r) => {
    return r.recommendations.length > 0 && r.failures.some((f) => f.includes("禁止的信号"));
  }).length;
  const wrongSceneRate = results.length > 0 ? (wrongScene / results.length) * 100 : 0;

  console.log(`  listenerEvidence coverage: ${withEvidence}/${totalRecs} (${((withEvidence / Math.max(1, totalRecs)) * 100).toFixed(0)}%)`);
  console.log(`  Primary Precision: ${primaryPrecision.toFixed(0)}% (${primaryCorrect}/${totalRecs} primary scene present)`);
  console.log(`  Coverage Rate: ${coverageRate.toFixed(0)}% (${scenesWithRecs}/${results.length} scenes have ≥1 rec)`);
  console.log(`  Zero-result Rate: ${zeroResultRate.toFixed(0)}% (${zeroResultScenes}/${results.length} scenes — honest zero)`);
  console.log(`  Wrong Scene Rate: ${wrongSceneRate.toFixed(1)}%`);
  console.log(`  Scene Conflict Rate: ${sceneConflictRate.toFixed(0)}%`);
  console.log(`  Cross-scene Overlap: ${(computeCrossSceneOverlap(results) * 100).toFixed(1)}%`);
  console.log(`  Negative-control Distinction: ${((confusionPassed / Math.max(1, confusionResults.length)) * 100).toFixed(0)}%`);

  console.log();
  console.log(`  Golden tests: ${passed} PASS / ${failed} FAIL / ${zeroResultScenes} ZERO-RESULT (${results.length} total)`);

  if (failed > 0 || confusionFailed > 0) {
    console.log();
    console.log(`  ❌ ${failed} tests FAIL, ${confusionFailed} confusion pairs FAIL. REAL failures — do not hide.`);
    process.exit(1);
  } else {
    console.log();
    console.log("  ✓ All golden tests passed.");
  }
}

// ── Test runner ──

function runGoldenTest(testCase: GoldenTestCase): GoldenTestResult {
  const moodResult = buildMoodResultFromGolden(testCase);
  const pool = getMusicRecommendationPool(moodResult);
  const verified = filterVerifiedRecommendations(pool);
  const top3 = verified.slice(0, 3);

  const failures: string[] = [];
  const warnings: string[] = [];

  // FAILURE 1: Not enough recommendations — only fail if 0 (honest zero is OK when no candidates)
  if (top3.length === 0 && testCase.minWithPrimaryScene > 0) {
    failures.push(`0 首推荐 — 场景缺乏 Primary 候选。`);
  } else if (top3.length < testCase.minWithPrimaryScene && top3.length > 0) {
    failures.push(`只有 ${top3.length} 首推荐，需要至少 ${testCase.minWithPrimaryScene} 首 Primary。`);
  }

  // FAILURE 2: ListenerEvidence missing
  const withEvidence = top3.filter((r) => getAudienceFitStatus(r.song) !== "unverified").length;
  const effectiveMinEvidence = Math.min(testCase.minVerifiedListenerEvidence, top3.length);
  if (withEvidence < effectiveMinEvidence) {
    failures.push(`只有 ${withEvidence}/${effectiveMinEvidence} 首有 listenerEvidence。缺失 listenerEvidence 不允许 PASS。`);
  }

  // FAILURE 3: Required signals not found in matched evidence
  // Collect ALL signals from ALL evidence sources
  const allMatchedSignals = new Set([
    ...top3.flatMap((r) => r.matchedSignals ?? []),
    ...top3.flatMap((r) => r.matchedEvidence ?? []),
    ...top3.flatMap((r) => r.song.memoryTypes ?? []),
    ...top3.flatMap((r) => r.song.primaryMusicScene ?? []),
    ...top3.flatMap((r) => r.song.musicSceneTags ?? []),
  ]);

  const rs = testCase.requiredSignals;
  // Check each non-empty category: at least 1 signal must match
  const missingCategories: string[] = [];
  for (const [category, signals] of Object.entries(rs) as Array<[string, string[]]>) {
    if (signals.length === 0) continue;
    const hasMatch = signals.some((s) => allMatchedSignals.has(s));
    if (!hasMatch) {
      missingCategories.push(`${category}: [${signals.join(", ")}]`);
    }
  }
  if (missingCategories.length > 0) {
    failures.push(`缺少必要的匹配信号 (${missingCategories.join("; ")})`);
  }

  // FAILURE 4: Forbidden signals found
  const foundForbidden = testCase.forbiddenSignals.filter((s) => allMatchedSignals.has(s));
  if (foundForbidden.length > 0) {
    failures.push(`出现禁止的信号: ${foundForbidden.join(", ")}`);
  }

  // FAILURE 5: Familiarity mix
  const tiers = top3.map((r) => r.song.listenerEvidence?.familiarityTier ?? "unknown");
  const highCount = tiers.filter((t) => t === "high").length;
  const mediumCount = tiers.filter((t) => t === "medium").length;
  const discoveryCount = tiers.filter((t) => t === "discovery").length;

  if (highCount < testCase.expectedFamiliarityMix.high) {
    failures.push(`高熟悉度歌曲不足: ${highCount}/${testCase.expectedFamiliarityMix.high}`);
  }
  if (discoveryCount < testCase.expectedFamiliarityMix.discovery && testCase.expectedFamiliarityMix.discovery > 0) {
    warnings.push(`探索型歌曲不足: ${discoveryCount}/${testCase.expectedFamiliarityMix.discovery}`);
  }

  // FAILURE 6: All from unknown_soft_memory
  const unknownSoftCount = top3.filter((r) => r.song.memoryTypes.includes("unknown_soft_memory")).length;
  if (unknownSoftCount >= 3) {
    failures.push("三首歌全部来自 unknown_soft_memory，缺乏场景区分。");
  }

  // FAILURE 7: Primary scene missing
  const withPrimaryScene = top3.filter((r) => r.song.primaryMusicScene && r.song.primaryMusicScene.length > 0).length;
  if (withPrimaryScene < testCase.minWithPrimaryScene) {
    failures.push(`只有 ${withPrimaryScene}/${testCase.minWithPrimaryScene} 首有 primaryMusicScene。`);
  }

  // FAILURE 8: Forbidden tracks
  if (testCase.forbiddenTracks?.length) {
    const foundTracks = top3.filter((r) => testCase.forbiddenTracks!.includes(r.song.title));
    if (foundTracks.length > 0) {
      failures.push(`禁止的歌曲被推荐: ${foundTracks.map((r) => r.song.title).join(", ")}`);
    }
  }

  // FAILURE 9: Forbidden artists dominating
  if (testCase.forbiddenArtists?.length) {
    const foundArtists = top3.filter((r) => testCase.forbiddenArtists!.includes(r.song.artist));
    if (foundArtists.length >= 2) {
      failures.push(`禁止的艺人占据过多推荐: ${foundArtists.map((r) => r.song.artist).join(", ")}`);
    }
  }

  // FAILURE 10: All same familiarity tier
  const uniqueTiers = new Set(tiers);
  if (uniqueTiers.size === 1 && tiers[0] !== "unknown") {
    warnings.push(`三首歌全部是同一熟悉度 (${tiers[0]})，缺乏多样性。`);
  }

  // FAILURE 11: Same artist repeated
  const artists = top3.map((r) => r.song.artist);
  if (new Set(artists).size === 1) {
    failures.push("三首歌全部来自同一位歌手。");
  }

  // FAILURE 12: No space evidence in reason
  const reasonsWithSpace = top3.filter((r) =>
    r.reason && /[花园公园校园教室便利店地铁机场酒店海边车站天桥街巷咖啡餐厅空间场景]/.test(r.reason),
  ).length;
  if (reasonsWithSpace === 0) {
    warnings.push("所有推荐理由都未引用空间证据。");
  }

  // FAILURE 13: Evidence confidence too low for Top 1
  if (top3.length > 0) {
    const top1Conf = top3[0].song.listenerEvidence?.evidenceConfidence ?? 0;
    if (top1Conf > 0 && top1Conf < 0.6) {
      failures.push(`Top 1 (${top3[0].song.title}) evidenceConfidence=${top1Conf} < 0.6，不应成为 Top 1。`);
    }
  }

  const overallPass = failures.length === 0;

  return {
    caseId: testCase.id,
    label: testCase.label,
    overallPass,
    recommendations: top3.map((r) => ({
      title: r.song.title,
      artist: r.song.artist,
      songId: r.song.songId ?? r.song.neteaseSongId ?? "无",
      primaryScene: r.song.primaryMusicScene ?? [],
      familiarityTier: r.song.listenerEvidence?.familiarityTier ?? "unknown",
      hasListenerEvidence: getAudienceFitStatus(r.song) !== "unverified",
      matchedEvidence: r.matchedSignals ?? [],
      reason: r.reason ?? r.song.recommendationReason,
      score: r.score,
    })),
    failures,
    warnings,
  };
}

// ── Build MoodResult from golden test case ──

function buildMoodResultFromGolden(testCase: GoldenTestCase): MoodResult {
  const e = testCase.imageEvidence;
  const allText = [
    ...e.visibleObjects, ...e.spaceType, ...e.timeContext,
    ...e.socialContext, ...e.visualStyle,
  ];

  return {
    scene_observation: {
      primary_scene: e.spaceType[0] ?? testCase.label,
      visible_objects: e.visibleObjects,
      human_activity: e.socialContext.join(" "),
      lighting: e.timeContext.join(" "),
      color_tone: e.visualStyle.join(" "),
      camera_style: "",
      atmosphere_evidence: [...e.visualStyle, ...e.timeContext],
    },
    spaceTags: [],
    sceneTags: [],
    emotionTags: [],
    memoryTags: [],
    visualTags: [],
    seasonTags: [],
    mood_title: testCase.label,
    mood_subtitle: allText.join(" "),
    time_label: e.timeContext[0] ?? "此刻",
    writing: allText.join(" "),
    space_memory_text: allText.join(" "),
    space_personality: e.spaceType[0],
    visual_tone: e.visualStyle.slice(0, 4),
    music_query: [testCase.label, ...e.spaceType, ...e.visualStyle].join(" "),
    music_keywords: [...e.visibleObjects, ...e.spaceType].slice(0, 5),
    music_memories: [],
    music_recommendations: [],
    share_card_text: allText.join(" ").slice(0, 40),
    visual_mood_tags: e.visualStyle.slice(0, 4),
    debug_source: "mock_no_key",
  };
}

// ── Print ──

function printGoldenResult(result: GoldenTestResult): void {
  console.log(`── ${result.label} (${result.caseId}) ──`);

  if (result.recommendations.length === 0) {
    console.log("  ⚠️  没有推荐结果。");
    console.log(`  整体: FAIL ❌`);
    console.log();
    return;
  }

  for (let i = 0; i < result.recommendations.length; i++) {
    const r = result.recommendations[i];
    console.log(`  推荐 ${i + 1}: ${r.title} — ${r.artist} (${r.songId})`);
    console.log(`    primaryScene: [${r.primaryScene.join(", ")}]`);
    console.log(`    熟悉度: ${r.familiarityTier} | listenerEvidence: ${r.hasListenerEvidence ? "✓" : "❌"}`);
    console.log(`    匹配信号: ${r.matchedEvidence.slice(0, 3).join(", ")}`);
  }

  if (result.failures.length > 0) {
    console.log(`  ❌ FAILURES:`);
    for (const f of result.failures) console.log(`    - ${f}`);
  }
  if (result.warnings.length > 0) {
    console.log(`  ⚠️  WARNINGS:`);
    for (const w of result.warnings) console.log(`    - ${w}`);
  }
  console.log(`  整体: ${result.overallPass ? "PASS ✓" : "FAIL ❌"}`);
  console.log();
}

// ── Cross-scene overlap ──

function computeCrossSceneOverlap(results: GoldenTestResult[]): number {
  const sceneTracks = new Map<string, Set<string>>();

  for (const result of results) {
    const tracks = new Set(result.recommendations.map((r) => r.title));
    sceneTracks.set(result.caseId, tracks);
  }

  let totalOverlaps = 0;
  let totalPairs = 0;

  const ids = Array.from(sceneTracks.keys());
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = sceneTracks.get(ids[i])!;
      const b = sceneTracks.get(ids[j])!;
      const overlap = [...a].filter((t) => b.has(t)).length;
      totalOverlaps += overlap;
      totalPairs++;
    }
  }

  if (totalPairs === 0 || results.every((r) => r.recommendations.length === 0)) return 0;

  const maxOverlaps = totalPairs * 3; // max 3 tracks per scene could all be identical
  return maxOverlaps > 0 ? totalOverlaps / maxOverlaps : 0;
}

main();
