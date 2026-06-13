/**
 * Human Evaluation Template
 *
 * For each recommendation, human reviewers should score:
 * - 歌曲真实: 0 (fake/tag) or 1 (real verified song)
 * - 空间匹配: 1 (completely wrong) to 5 (perfect match)
 * - 中国用户熟悉度: 1 (nobody knows) to 5 (everyone knows)
 * - 文化违和度: 1 (perfectly natural for Chinese audience) to 5 (completely out of place)
 * - 推荐惊喜感: 1 (boring/obvious) to 5 (delightful discovery)
 * - 理由可信度: 1 (nonsense) to 5 (convincing evidence-based)
 * - 是否愿意播放: "是" or "否"
 *
 * Generate CSV/JSON report with: npx tsx scripts/report-human-eval.ts
 */

export type HumanEvalScore = {
  /** Test scene identifier */
  sceneId: string;
  sceneLabel: string;

  /** Recommendation index (1-3) */
  recommendationIndex: number;

  /** Song title */
  title: string;
  /** Song artist */
  artist: string;
  /** Verified song ID */
  songId: string;

  /** 0 = fake/tag, 1 = real verified song */
  songAuthenticity: 0 | 1;
  /** 1 = completely wrong space, 5 = perfect match */
  spaceMatch: 1 | 2 | 3 | 4 | 5;
  /** 1 = unknown, 5 = universally known */
  chineseFamiliarity: 1 | 2 | 3 | 4 | 5;
  /** 1 = perfectly natural, 5 = culturally jarring */
  culturalDiscomfort: 1 | 2 | 3 | 4 | 5;
  /** 1 = boring, 5 = delightful discovery */
  surpriseValue: 1 | 2 | 3 | 4 | 5;
  /** 1 = nonsense, 5 = convincing */
  reasonCredibility: 1 | 2 | 3 | 4 | 5;
  /** Would you play this song? */
  wouldPlay: "是" | "否";

  /** Free-text notes from reviewer */
  reviewerNotes: string;
};

/**
 * Generate empty evaluation template for a set of scene recommendations.
 */
export function createEmptyEvalTemplate(
  sceneRecommendations: Array<{
    sceneId: string;
    sceneLabel: string;
    recommendations: Array<{ title: string; artist: string; songId: string }>;
  }>,
): HumanEvalScore[] {
  const template: HumanEvalScore[] = [];

  for (const scene of sceneRecommendations) {
    for (let i = 0; i < scene.recommendations.length; i++) {
      const rec = scene.recommendations[i];
      template.push({
        sceneId: scene.sceneId,
        sceneLabel: scene.sceneLabel,
        recommendationIndex: i + 1,
        title: rec.title,
        artist: rec.artist,
        songId: rec.songId,
        songAuthenticity: 0,
        spaceMatch: 3,
        chineseFamiliarity: 3,
        culturalDiscomfort: 3,
        surpriseValue: 3,
        reasonCredibility: 3,
        wouldPlay: "否",
        reviewerNotes: "",
      });
    }
  }

  return template;
}

/**
 * Generate CSV header and rows from evaluation data.
 */
export function toCSV(scores: HumanEvalScore[]): string {
  const headers = [
    "sceneId", "sceneLabel", "recommendationIndex",
    "title", "artist", "songId",
    "songAuthenticity", "spaceMatch", "chineseFamiliarity",
    "culturalDiscomfort", "surpriseValue", "reasonCredibility",
    "wouldPlay", "reviewerNotes",
  ];

  const rows = scores.map((s) =>
    [
      s.sceneId, `"${s.sceneLabel}"`, s.recommendationIndex,
      `"${s.title}"`, `"${s.artist}"`, s.songId,
      s.songAuthenticity, s.spaceMatch, s.chineseFamiliarity,
      s.culturalDiscomfort, s.surpriseValue, s.reasonCredibility,
      s.wouldPlay, `"${s.reviewerNotes.replace(/"/g, '""')}"`,
    ].join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Compute aggregate scores for a scene.
 */
export function computeSceneAggregates(scores: HumanEvalScore[]): {
  avgSpaceMatch: number;
  avgFamiliarity: number;
  avgCulturalDiscomfort: number;
  avgSurpriseValue: number;
  avgReasonCredibility: number;
  wouldPlayRate: number;
  authenticityRate: number;
} {
  if (scores.length === 0) {
    return {
      avgSpaceMatch: 0, avgFamiliarity: 0, avgCulturalDiscomfort: 0,
      avgSurpriseValue: 0, avgReasonCredibility: 0,
      wouldPlayRate: 0, authenticityRate: 0,
    };
  }

  return {
    avgSpaceMatch: scores.reduce((s, r) => s + r.spaceMatch, 0) / scores.length,
    avgFamiliarity: scores.reduce((s, r) => s + r.chineseFamiliarity, 0) / scores.length,
    avgCulturalDiscomfort: scores.reduce((s, r) => s + r.culturalDiscomfort, 0) / scores.length,
    avgSurpriseValue: scores.reduce((s, r) => s + r.surpriseValue, 0) / scores.length,
    avgReasonCredibility: scores.reduce((s, r) => s + r.reasonCredibility, 0) / scores.length,
    wouldPlayRate: scores.filter((r) => r.wouldPlay === "是").length / scores.length,
    authenticityRate: scores.filter((r) => r.songAuthenticity === 1).length / scores.length,
  };
}
