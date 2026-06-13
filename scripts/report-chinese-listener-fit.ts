/**
 * Chinese Listener Fit Report
 *
 * Generates a human-readable audit report for each Chinese listener test scenario.
 * Run with: tsx scripts/report-chinese-listener-fit.ts
 *
 * Output:
 * - For each test scene: scene tags, top-3 recommendations, PASS/FAIL status
 * - Library-wide distribution statistics
 * - Cultural fit warnings
 */

import { chineseListenerTestCases, extendedChineseListenerTestCases } from "../data/chinese-listener-music-test-cases";
import {
  verifiedMusicLibrary,
  computeAudienceFit,
  getMusicRecommendationPool,
  filterVerifiedRecommendations,
  getAudienceFitStatus,
  type MusicSong,
} from "../lib/music-library";
import type { AudienceFit } from "../lib/music-library";
import type { SpaceMemoryType } from "../lib/space-memory-taxonomy";
import type { NormalizedMusicContext } from "../lib/visual-grounding";
import { inferMoodTaxonomyTags } from "../lib/taxonomy";
import type { MoodResult } from "../lib/mood-schema";

// ── Report helpers ──

type TestReportLine = {
  label: string;
  songs: Array<{
    title: string;
    artist: string;
    songId: string;
    sceneFit: string;
    chineseListenerFit: string;
    culturalContext: string;
    reason: string;
    pass: boolean;
  }>;
  hasTagAsSong: boolean;
  hasForeignDomination: boolean;
  hasOverGenericSong: boolean;
  hasCulturalConflict: boolean;
  hasUnverifiedEvidence: boolean;
  allFromUnknownSoftMemory: boolean;
  overallPass: boolean;
};

function generateReport(): void {
  console.log("=".repeat(70));
  console.log("  HearSpace 中国用户听感审计报告");
  console.log("  Chinese Listener Fit Audit Report");
  console.log("=".repeat(70));
  console.log();

  // ── Section 1: Library Distribution ──
  printLibraryDistribution();

  // ── Section 2: Per-scene reports ──
  const allCases = [
    ...chineseListenerTestCases.map((c) => ({ ...c, source: "core" as const })),
    ...extendedChineseListenerTestCases.map((c) => ({
      id: c.id,
      label: c.label,
      source: "extended" as const,
      acceptableCultures: c.acceptableCultures,
      preferredLanguages: c.preferredLanguages,
      minimumChineseListenerFit: c.minimumChineseListenerFit,
      forbiddenMusicScenes: c.forbiddenMusicScenes,
      photoEvidence: {
        scene: c.sceneDescription,
        visibleElements: [],
        lighting: "",
        colorTone: "",
        activity: "",
        atmosphereEvidence: [],
      },
    })),
  ];

  let totalPass = 0;
  let totalFail = 0;

  for (const testCase of allCases) {
    console.log("-".repeat(60));
    console.log(`  场景: ${testCase.label} (${testCase.id})`);
    console.log(`  描述: ${testCase.photoEvidence.scene}`);
    console.log(`  偏好语言: ${testCase.preferredLanguages.join(", ")}`);
    console.log(`  最低文化适配度: ${testCase.minimumChineseListenerFit}`);
    console.log();

    // Simulate recommendations for this scene
    const result = simulateRecommendations(testCase);
    printSceneReport(result);

    if (result.overallPass) totalPass++;
    else totalFail++;

    console.log();
  }

  // ── Section 3: Summary ──
  console.log("=".repeat(70));
  console.log(`  总计: ${totalPass + totalFail} 个场景`);
  console.log(`  PASS: ${totalPass}`);
  console.log(`  FAIL: ${totalFail}`);
  console.log(`  通过率: ${((totalPass / (totalPass + totalFail)) * 100).toFixed(1)}%`);
  console.log("=".repeat(70));
}

function printLibraryDistribution(): void {
  console.log("── 曲库分布统计 ──");
  console.log();

  // Count by language from audienceFit/listenerEvidence
  const languageCounts: Record<string, number> = {};
  const artistCounts: Record<string, number> = {};
  const familiarityCounts = { high: 0, medium: 0, discovery: 0, unknown: 0 };
  const mainstreamCounts: Record<string, number> = { mainstream: 0, familiar: 0, niche: 0, discovery: 0, unknown: 0 };
  const memoryTypeCounts: Record<string, number> = {};
  let totalSongs = 0;

  for (const song of verifiedMusicLibrary) {
    totalSongs++;

    // Language
    const fit = song.audienceFit ?? computeAudienceFit(song);
    if (fit) {
      languageCounts[fit.language] = (languageCounts[fit.language] ?? 0) + 1;
      mainstreamCounts[fit.mainstreamLevel] = (mainstreamCounts[fit.mainstreamLevel] ?? 0) + 1;
    } else {
      languageCounts["未标记"] = (languageCounts["未标记"] ?? 0) + 1;
      mainstreamCounts["unknown"] = (mainstreamCounts["unknown"] ?? 0) + 1;
    }

    // Familiarity tier
    const tier = song.listenerEvidence?.familiarityTier ?? "unknown";
    familiarityCounts[tier] = (familiarityCounts[tier] ?? 0) + 1;

    // Artist
    const artist = song.artist.replace(/\s*[-–—/|&,，]\s*/g, "").trim();
    artistCounts[artist] = (artistCounts[artist] ?? 0) + 1;

    // Memory types
    for (const type of song.memoryTypes) {
      memoryTypeCounts[type] = (memoryTypeCounts[type] ?? 0) + 1;
    }
  }

  console.log(`  总歌曲数: ${totalSongs}`);

  console.log();
  console.log("  语言分布:");
  for (const [lang, count] of Object.entries(languageCounts).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / totalSongs) * 100).toFixed(1);
    console.log(`    ${lang}: ${count} (${pct}%)`);
  }

  console.log();
  console.log("  熟悉度分布:");
  for (const [tier, count] of Object.entries(familiarityCounts).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / totalSongs) * 100).toFixed(1);
    console.log(`    ${tier}: ${count} (${pct}%)`);
  }

  console.log();
  console.log("  主流程度分布:");
  for (const [level, count] of Object.entries(mainstreamCounts).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / totalSongs) * 100).toFixed(1);
    console.log(`    ${level}: ${count} (${pct}%)`);
  }

  // Artists with >1 song
  const repeatedArtists = Object.entries(artistCounts).filter(([, count]) => count > 1);
  console.log();
  console.log(`  艺人重复率: ${repeatedArtists.length} 位艺人有多首歌`);
  for (const [artist, count] of repeatedArtists.sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`    ${artist}: ${count} 首`);
  }

  console.log();
  console.log("  空间类型分布:");
  for (const [type, count] of Object.entries(memoryTypeCounts).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / totalSongs) * 100).toFixed(1);
    console.log(`    ${type}: ${count} (${pct}%)`);
  }

  // Cultural fit warnings
  console.log();
  console.log("  文化适配警告:");
  const lowChineseFitSongs = verifiedMusicLibrary.filter((s) => {
    const fit = s.audienceFit ?? computeAudienceFit(s);
    return fit && fit.chineseListenerFit < 0.5;
  });
  if (lowChineseFitSongs.length > 0) {
    console.log(`    低中国用户适配度 (<0.5): ${lowChineseFitSongs.length} 首`);
    for (const s of lowChineseFitSongs.slice(0, 5)) {
      const fit = s.audienceFit ?? computeAudienceFit(s);
      console.log(`      - ${s.title} / ${s.artist} (lang: ${fit?.language ?? "?"}, fit: ${fit?.chineseListenerFit?.toFixed(2) ?? "?"})`);
    }
  } else {
    console.log("    无低适配度歌曲。");
  }

  const foreignSongs = verifiedMusicLibrary.filter((s) => {
    const fit = s.audienceFit ?? computeAudienceFit(s);
    return fit && !["Mandarin", "Cantonese", "Instrumental"].includes(fit.language);
  });
  console.log();
  console.log(`  外语歌曲 (非华语/纯音乐): ${foreignSongs.length} 首 (${((foreignSongs.length / totalSongs) * 100).toFixed(1)}%)`);
  for (const s of foreignSongs.slice(0, 8)) {
    const fit = s.audienceFit ?? computeAudienceFit(s);
    console.log(`    - ${s.title} / ${s.artist} (${fit?.language ?? "?"})`);
  }

  console.log();
}

function simulateRecommendations(testCase: {
  id: string;
  label: string;
  photoEvidence: { scene: string; visibleElements: string[]; lighting: string; colorTone: string; activity: string; atmosphereEvidence: string[] };
  acceptableCultures: string[];
  preferredLanguages: string[];
  minimumChineseListenerFit: number;
  forbiddenMusicScenes?: string[];
}): TestReportLine {
  // Build a MoodResult that getMusicRecommendationPool can consume
  const moodResult = buildMoodResultFromTestCase(testCase);
  const pool = getMusicRecommendationPool(moodResult);
  const verified = filterVerifiedRecommendations(pool);
  const top3 = verified.slice(0, 3);

  // Check for tag-as-song
  const forbiddenTitles = [
    "春日", "花园", "胶片感", "治愈", "孤独", "黄昏", "柔和",
    "城市夜晚", "温柔", "安静", "华语", "独立音乐", "民谣",
  ];
  const hasTagAsSong = top3.some((item) => forbiddenTitles.includes(item.song.title));

  // Check for foreign domination
  const foreignCount = top3.filter((item) => {
    const fit = item.song.audienceFit ?? computeAudienceFit(item.song);
    const lang = fit?.language;
    return lang && !["Mandarin", "Cantonese"].includes(lang);
  }).length;
  const hasForeignDomination = foreignCount >= 3;

  // Check for over-generic songs
  const hasOverGenericSong = top3.some((item) => item.song.memoryTypes.length > 5);

  // Check for cultural conflict
  // listenerEvidence 缺失 → 无法验证文化适配 → FAIL
  const hasCulturalConflict = top3.some((item) => {
    const fit = item.song.audienceFit ?? computeAudienceFit(item.song);
    if (!fit) return true; // missing listenerEvidence = cultural fit unverifiable
    return fit.chineseListenerFit < 0.4;
  });

  // listenerEvidence must exist — unverified is a hard failure
  const hasUnverifiedEvidence = top3.some((item) =>
    getAudienceFitStatus(item.song) === "unverified",
  );

  // All from unknown_soft_memory → no scene discrimination
  const allFromUnknownSoftMemory = top3.length > 0 && top3.every(
    (item) => item.song.memoryTypes.includes("unknown_soft_memory"),
  );

  // Check if recommendations are DOMINATED by forbidden scene types
  let hasForbiddenScene = false;
  if (testCase.forbiddenMusicScenes?.length) {
    hasForbiddenScene = top3.every((item) =>
      item.song.musicSceneTags.some((tag) =>
        testCase.forbiddenMusicScenes!.includes(tag),
      ),
    ) && top3.length > 0;
  }

  const overallPass =
    top3.length >= 1 &&
    !hasTagAsSong &&
    !hasForeignDomination &&
    !hasForbiddenScene &&
    !hasUnverifiedEvidence &&
    !allFromUnknownSoftMemory &&
    !hasCulturalConflict;

  return {
    label: testCase.label,
    songs: top3.map((item) => {
      const fit = item.song.audienceFit ?? computeAudienceFit(item.song);
      return {
        title: item.song.title,
        artist: item.song.artist,
        songId: item.song.songId ?? item.song.neteaseSongId ?? "无",
        sceneFit: item.score > 0 ? "匹配" : "弱匹配",
        chineseListenerFit: fit
          ? `${(fit.chineseListenerFit * 100).toFixed(0)}%`
          : "未标记",
        culturalContext: fit?.culturalContext?.join("、") ?? "未标记",
        reason: item.reason || item.song.recommendationReason,
        pass: item.score > -4,
      };
    }),
    hasTagAsSong,
    hasForeignDomination,
    hasOverGenericSong,
    hasCulturalConflict,
    hasUnverifiedEvidence,
    allFromUnknownSoftMemory,
    overallPass,
  };
}

function buildMoodResultFromTestCase(testCase: {
  id: string;
  label: string;
  photoEvidence: { scene: string; visibleElements: string[]; lighting: string; colorTone: string; activity: string; atmosphereEvidence: string[] };
  acceptableCultures: string[];
  preferredLanguages: string[];
}): MoodResult {
  const e = testCase.photoEvidence;
  const allText = [
    e.scene, ...e.visibleElements, e.lighting, e.colorTone,
    e.activity, ...e.atmosphereEvidence,
  ];

  return {
    scene_observation: {
      primary_scene: e.scene,
      visible_objects: e.visibleElements,
      human_activity: e.activity,
      lighting: e.lighting,
      color_tone: e.colorTone,
      camera_style: "test",
      atmosphere_evidence: e.atmosphereEvidence,
    },
    spaceTags: [],
    sceneTags: [],
    emotionTags: [],
    memoryTags: [],
    visualTags: [],
    seasonTags: [],
    mood_title: testCase.label,
    mood_subtitle: allText.join(" "),
    time_label: e.lighting || "此刻",
    writing: allText.join(" "),
    space_memory_text: allText.join(" "),
    space_personality: e.scene,
    visual_tone: e.atmosphereEvidence.slice(0, 4),
    music_query: `${e.scene} ${testCase.preferredLanguages.join(" ")} ${e.atmosphereEvidence.join(" ")}`,
    music_keywords: [...e.atmosphereEvidence, ...e.visibleElements].slice(0, 5),
    music_memories: [],
    music_recommendations: [],
    share_card_text: allText.join(" ").slice(0, 40),
    visual_mood_tags: e.atmosphereEvidence.slice(0, 4),
    debug_source: "mock_no_key",
  };
}

function printSceneReport(report: TestReportLine): void {
  if (report.songs.length === 0) {
    console.log("  ⚠️  没有匹配的歌曲！");
    console.log("  FAIL: 曲库缺乏该场景的歌曲覆盖");
    return;
  }

  for (let i = 0; i < report.songs.length; i++) {
    const s = report.songs[i];
    console.log(`  推荐 ${i + 1}:`);
    console.log(`    歌曲: ${s.title}`);
    console.log(`    歌手: ${s.artist}`);
    console.log(`    songId: ${s.songId}`);
    console.log(`    场景匹配: ${s.sceneFit}`);
    console.log(`    中国用户熟悉度: ${s.chineseListenerFit}`);
    console.log(`    文化语境: ${s.culturalContext}`);
    console.log(`    推荐原因: ${s.reason.slice(0, 80)}`);
    console.log(`    ${s.pass ? "PASS" : "FAIL"}`);
    console.log();
  }

  console.log(`  是否出现标签冒充歌曲: ${report.hasTagAsSong ? "是 ❌" : "否 ✓"}`);
  console.log(`  是否出现外国歌曲占比过高: ${report.hasForeignDomination ? "是 ❌" : "否 ✓"}`);
  console.log(`  是否出现泛热门歌曲: ${report.hasOverGenericSong ? "是 ⚠️" : "否 ✓"}`);
  console.log(`  是否存在明显文化违和: ${report.hasCulturalConflict ? "是 ❌" : "否 ✓"}`);
  console.log(`  listenerEvidence 是否缺失: ${report.hasUnverifiedEvidence ? "是 ❌" : "否 ✓"}`);
  console.log(`  是否全部来自 unknown_soft_memory: ${report.allFromUnknownSoftMemory ? "是 ❌" : "否 ✓"}`);
  console.log(`  整体: ${report.overallPass ? "PASS ✓" : "FAIL ❌"}`);
}

function scoreTextMatch(contextTokens: string[], song: MusicSong): number {
  const songText = [
    ...song.scenes,
    ...song.emotions,
    ...song.visibleObjects,
    ...song.musicSceneTags,
    ...song.usageScenes,
  ].flatMap((t) => t.toLowerCase().split(/[\s,，、]+/).filter(Boolean));

  let score = 0;
  for (const token of contextTokens) {
    for (const songToken of songText) {
      if (token === songToken) score += 2;
      else if (songToken.includes(token) || token.includes(songToken)) score += 1;
    }
  }

  return score;
}

// ── Hard assertions (must NOT fail) ──

function runHardAssertions(): void {
  console.log("── 硬断言检查 ──");
  console.log();

  const forbiddenTitles = [
    "春日", "花园", "胶片感", "治愈", "孤独", "黄昏", "柔和",
    "城市夜晚", "温柔", "安静", "华语", "独立音乐", "民谣",
    "青春", "回忆", "电影感",
  ];

  let assertionsPassed = 0;
  let assertionsFailed = 0;

  function assert(condition: boolean, message: string): void {
    if (condition) {
      console.log(`  ✓ ${message}`);
      assertionsPassed++;
    } else {
      console.log(`  ❌ ${message}`);
      assertionsFailed++;
    }
  }

  // 1. No song in the library has a forbidden title
  const songsWithForbiddenTitles = verifiedMusicLibrary.filter((s) =>
    forbiddenTitles.includes(s.title),
  );
  assert(
    songsWithForbiddenTitles.length === 0,
    `1. 曲库中没有标签冒充的歌曲 (发现 ${songsWithForbiddenTitles.length} 首: ${songsWithForbiddenTitles.map((s) => s.title).join(", ") || "无"})`,
  );

  // 2. Every verified song has title and artist
  const songsWithoutTitleOrArtist = verifiedMusicLibrary.filter(
    (s) => !s.title || !s.artist,
  );
  assert(
    songsWithoutTitleOrArtist.length === 0,
    `2. 所有歌曲都有 title 和 artist (缺失 ${songsWithoutTitleOrArtist.length} 首)`,
  );

  // 3. Every verified song has a songId
  const songsWithoutSongId = verifiedMusicLibrary.filter(
    (s) => !s.songId && !s.neteaseSongId,
  );
  assert(
    songsWithoutSongId.length === 0,
    `3. 所有歌曲都有 verified songId (缺失 ${songsWithoutSongId.length} 首)`,
  );

  // 4. No song has metadataVerified=false while being in verified pool
  const unverifiedInPool = verifiedMusicLibrary.filter(
    (s) => s.metadataVerified !== true,
  );
  assert(
    unverifiedInPool.length === 0,
    `4. verifiedMusicLibrary 中无未验证歌曲 (发现 ${unverifiedInPool.length} 首)`,
  );

  // 5. Chinese listener test scenes: check that no scene's top 3 is all foreign
  const allScenes = [
    ...chineseListenerTestCases,
    ...extendedChineseListenerTestCases.map((c) => ({
      id: c.id,
      label: c.label,
      preferredLanguages: c.preferredLanguages,
      minimumChineseListenerFit: c.minimumChineseListenerFit,
      photoEvidence: {
        scene: c.sceneDescription,
        visibleElements: [],
        lighting: "",
        colorTone: "",
        activity: "",
        atmosphereEvidence: [],
      },
    })),
  ];
  let foreignDominationCount = 0;
  for (const scene of allScenes) {
    const result = simulateRecommendations(scene as Parameters<typeof simulateRecommendations>[0]);
    if (result.hasForeignDomination) foreignDominationCount++;
  }
  assert(
    foreignDominationCount === 0,
    `5. 所有场景 Top 3 不全为外语歌曲 (发现 ${foreignDominationCount} 个场景)`,
  );

  // 6. Check that no scene's ALL recommendations are from forbidden scene types
  let sceneMismatchCount = 0;
  for (const scene of chineseListenerTestCases) {
    const result = simulateRecommendations(scene as unknown as Parameters<typeof simulateRecommendations>[0]);
    // Only fail if ALL recommended songs fall into forbidden scene types
    if (result.songs.length > 0 && scene.forbiddenMusicScenes?.length) {
      const allForbidden = result.songs.every((s) => {
        const songInLib = verifiedMusicLibrary.find((lib) => lib.title === s.title);
        return songInLib && scene.forbiddenMusicScenes!.some((fs) =>
          songInLib.musicSceneTags.includes(fs),
        );
      });
      if (allForbidden) sceneMismatchCount++;
    }
  }
  assert(
    sceneMismatchCount === 0,
    `6. 所有推荐均来自禁止音乐场景的场景数 (发现 ${sceneMismatchCount} 个)`,
  );

  // 7. No tag-as-song in any test scene
  let tagAsSongCount = 0;
  for (const scene of allScenes) {
    const result = simulateRecommendations(scene as Parameters<typeof simulateRecommendations>[0]);
    if (result.hasTagAsSong) tagAsSongCount++;
  }
  assert(
    tagAsSongCount === 0,
    `7. 没有场景出现标签冒充歌曲 (发现 ${tagAsSongCount} 个场景)`,
  );

  // 8. verifiedMusicLibrary songs must have musicSceneTags
  const songsWithoutSceneTags = verifiedMusicLibrary.filter(
    (s) => !s.musicSceneTags?.length,
  );
  assert(
    songsWithoutSceneTags.length === 0,
    `8. 所有歌曲都有 musicSceneTags (缺失 ${songsWithoutSceneTags.length} 首)`,
  );

  console.log();
  console.log(`  断言通过: ${assertionsPassed}/${assertionsPassed + assertionsFailed}`);
  if (assertionsFailed > 0) {
    console.log(`  ❌ ${assertionsFailed} 个断言失败！`);
    process.exit(1);
  } else {
    console.log("  ✓ 所有断言通过");
  }
}

// ── Main ──

generateReport();
console.log();
runHardAssertions();
