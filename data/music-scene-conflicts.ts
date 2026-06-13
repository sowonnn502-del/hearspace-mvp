/**
 * Music Scene Conflict Matrix
 *
 * Hard exclusion rules: if a song's primaryMusicScene contains
 * a scene that conflicts with the target scene, the song is
 * immediately excluded — not just penalized.
 *
 * Conflicts are ASYMMETRIC: A→B conflict doesn't mean B→A conflict.
 */

export type SceneConflictRule = {
  /** The target scene we're matching for */
  targetScene: string;
  /** Scenes that MUST NOT appear in recommended songs for this target */
  forbiddenPrimaryScenes: string[];
  /** Reason for human auditability */
  reason: string;
};

export const MUSIC_SCENE_CONFLICTS: SceneConflictRule[] = [
  // ── Cafe Afternoon ──
  {
    targetScene: "Cafe Afternoon",
    forbiddenPrimaryScenes: [
      "Rainy Window",
      "Airport Waiting",
      "Subway / Empty Metro",
      "Concert Afterglow",
      "Late Night Convenience Store",
      "Bus Stop",
      "Empty Station",
    ],
    reason: "咖啡馆是白天室内社交空间，禁止雨夜、旅行、地铁、深夜场景。",
  },

  // ── Concert Afterglow ──
  {
    targetScene: "Concert Afterglow",
    forbiddenPrimaryScenes: [
      "Rainy Window",
      "Hotel Room",
      "Park Grass / Bench",
      "Late Night Convenience Store",
      "Airport Waiting",
      "Bus Stop",
    ],
    reason: "演唱会散场是集体/户外夜晚场景，禁止独处雨夜、酒店、公园。",
  },

  // ── Friends Gathering ──
  {
    targetScene: "Friends Gathering",
    forbiddenPrimaryScenes: [
      "Rainy Window",
      "Hotel Room",
      "Empty Station",
      "Airport Waiting",
      "Subway / Empty Metro",
      "Late Night Convenience Store",
      "Bus Stop",
      "Office Night",
    ],
    reason: "朋友聚餐是社交温暖场景，禁止独处、等待、旅行、深夜通勤。",
  },

  // ── Garden Portrait ──
  {
    targetScene: "Garden Portrait",
    forbiddenPrimaryScenes: [
      "Airport Waiting",
      "Train Window",
      "Subway / Empty Metro",
      "Hotel Room",
      "Late Night Convenience Store",
      "Bus Stop",
      "Office Night",
      "Bridge / Overpass",
    ],
    reason: "花园肖像在户外自然光下，禁止旅行、交通、深夜、办公场景。",
  },

  // ── Old Neighborhood ──
  {
    targetScene: "Old Neighborhood",
    forbiddenPrimaryScenes: [
      "Airport Waiting",
      "Seaside Sunset",
      "Office Night",
      "Subway / Empty Metro",
      "Late Night Convenience Store",
    ],
    reason: "老城区是日常居住空间，禁止旅行、海边、深夜便利店的漂泊感。",
  },

  // ── Campus Sunset ──
  {
    targetScene: "Campus Sunset",
    forbiddenPrimaryScenes: [
      "Late Night Convenience Store",
      "Airport Waiting",
      "Subway / Empty Metro",
      "Hotel Room",
      "Office Night",
    ],
    reason: "校园黄昏是青春校园空间，禁止深夜、旅行、酒店、加班。",
  },

  // ── Late Night Convenience Store ──
  {
    targetScene: "Late Night Convenience Store",
    forbiddenPrimaryScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden Portrait",
      "Seaside Sunset",
      "Cafe Afternoon",
    ],
    reason: "深夜便利店是城市孤独夜空间，禁止校园、公园、花园、海边日光场景。",
  },

  // ── Rainy Window ──
  {
    targetScene: "Rainy Window",
    forbiddenPrimaryScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden Portrait",
      "Seaside Sunset",
      "Cafe Afternoon",
      "Concert Afterglow",
      "Friends Gathering",
    ],
    reason: "雨天窗边是室内独处空间，禁止户外、社交、集体场景。",
  },

  // ── Airport Waiting ──
  {
    targetScene: "Airport Waiting",
    forbiddenPrimaryScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden Portrait",
      "Cafe Afternoon",
      "Friends Gathering",
    ],
    reason: "机场候机是旅行等待空间，禁止校园、公园、花园、社交。",
  },

  // ── Train Window ──
  {
    targetScene: "Train Window",
    forbiddenPrimaryScenes: [
      "Late Night Convenience Store",
      "Cafe Afternoon",
      "Friends Gathering",
      "Garden Portrait",
    ],
    reason: "高铁窗边是旅行移动空间，禁止便利店、咖啡馆、聚餐、花园。",
  },

  // ── Subway / Empty Metro ──
  {
    targetScene: "Subway / Empty Metro",
    forbiddenPrimaryScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden Portrait",
      "Cafe Afternoon",
      "Friends Gathering",
    ],
    reason: "地铁空站是城市通勤地下空间，禁止校园、公园、花园、社交。",
  },

  // ── Hotel Room ──
  {
    targetScene: "Hotel Room",
    forbiddenPrimaryScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden Portrait",
      "Cafe Afternoon",
      "Friends Gathering",
      "Concert Afterglow",
    ],
    reason: "酒店是临时独处空间，禁止校园、公园、花园、社交、集体。",
  },

  // ── Seaside Sunset ──
  {
    targetScene: "Seaside Sunset",
    forbiddenPrimaryScenes: [
      "Late Night Convenience Store",
      "Subway / Empty Metro",
      "Office Night",
      "Bus Stop",
    ],
    reason: "海边日落是户外自然空间，禁止深夜便利店、地铁、办公室。",
  },

  // ── Park Grass / Bench ──
  {
    targetScene: "Park Grass / Bench",
    forbiddenPrimaryScenes: [
      "Late Night Convenience Store",
      "Subway / Empty Metro",
      "Airport Waiting",
      "Office Night",
    ],
    reason: "公园草地是户外恢复空间，禁止深夜便利店、地铁、机场、办公室。",
  },

  // ── Office Night ──
  {
    targetScene: "Office Night",
    forbiddenPrimaryScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden Portrait",
      "Seaside Sunset",
      "Cafe Afternoon",
      "Friends Gathering",
    ],
    reason: "办公室加班是室内工作空间，禁止户外、社交、休闲场景。",
  },

  // ── Bridge / Overpass ──
  {
    targetScene: "Bridge / Overpass",
    forbiddenPrimaryScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden Portrait",
      "Cafe Afternoon",
      "Friends Gathering",
    ],
    reason: "天桥是城市交通空间，禁止校园、公园、花园、社交。",
  },

  // ── Bus Stop ──
  {
    targetScene: "Bus Stop",
    forbiddenPrimaryScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden Portrait",
      "Cafe Afternoon",
      "Friends Gathering",
    ],
    reason: "公交站是城市通勤等待空间，禁止校园、公园、花园、社交。",
  },
];

/**
 * Check if a target scene conflicts with a candidate song's primary scene.
 * Returns true if the song should be EXCLUDED.
 */
export function hasSceneConflict(
  targetScene: string,
  candidatePrimaryScenes: string[],
): boolean {
  const rule = MUSIC_SCENE_CONFLICTS.find((r) => r.targetScene === targetScene);
  if (!rule) return false;

  return candidatePrimaryScenes.some((scene) =>
    rule.forbiddenPrimaryScenes.includes(scene),
  );
}

/**
 * Get forbidden scenes for a target.
 */
export function getForbiddenScenes(targetScene: string): string[] {
  return MUSIC_SCENE_CONFLICTS.find((r) => r.targetScene === targetScene)
    ?.forbiddenPrimaryScenes ?? [];
}
