/**
 * Phase 4 Targeted Song Seeds
 *
 * Manually-curated songs for scenes that lack coverage.
 * ALL entries require NetEase metadata verification through the enrich pipeline.
 *
 * Scenes targeted:
 * - Cafe Afternoon (3-5 songs)
 * - Concert Afterglow (3-5 songs)
 * - Friends Gathering (3-5 songs)
 *
 * Old Neighborhood: already covered (8 existing songs)
 * Garden Portrait: reclassified from flower_dream_portrait
 */

import type { ListenerEvidence } from "../lib/music-library";

export type Phase4SeedSong = {
  neteaseKeyword: string;
  title: string;
  artist: string;
  /** Expected NetEase songId (to be verified by enrich) */
  expectedSongId?: string;
  /** Primary music scenes for hard gate matching */
  primaryMusicScene: string[];
  /** Memory types */
  memoryTypes: string[];
  /** Listener evidence */
  listenerEvidence: ListenerEvidence;
  /** Scene-specific signals */
  musicSceneTags: string[];
  /** Avoid scenes */
  avoidWhen: string[];
  /** Recommendation reason template */
  recommendationReason: string;
  /** Pace/light/mood */
  pace: "slow" | "medium" | "upbeat";
  lightTone: "dark" | "warm" | "cool" | "bright" | "soft" | "neutral";
  season: "spring" | "summer" | "autumn" | "winter" | "all";
};

export const phase4Seeds: Phase4SeedSong[] = [
  // ═══════════════════════════════════════
  // Cafe Afternoon (咖啡馆午后)
  // ═══════════════════════════════════════
  {
    neteaseKeyword: "下雨的夜晚 苏打绿",
    title: "下雨的夜晚",
    artist: "苏打绿",
    primaryMusicScene: ["Cafe Afternoon"],
    memoryTypes: ["city_park_restorative", "daily_life_home"],
    listenerEvidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.82,
      generationFit: ["90后", "00后", "独立流行听众"],
      culturalMemory: ["台湾独立流行", "雨天氛围"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["咖啡馆午后", "雨天窗边", "安静房间"],
      evidenceSource: "manual", evidenceConfidence: 0.80,
    },
    musicSceneTags: ["Cafe Afternoon"],
    avoidWhen: ["深夜", "便利店", "机场", "地铁"],
    recommendationReason: "适合咖啡馆窗边，雨声和音乐一起慢慢展开。",
    pace: "slow", lightTone: "soft", season: "all",
  },
  {
    neteaseKeyword: "儿歌 张悬",
    title: "儿歌",
    artist: "张悬",
    primaryMusicScene: ["Cafe Afternoon"],
    memoryTypes: ["city_park_restorative", "daily_life_home"],
    listenerEvidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["85后", "90后", "独立音乐听众"],
      culturalMemory: ["台湾独立民谣", "安稳日常"],
      likelyAudience: ["85后", "90后"],
      suitableChineseScenes: ["咖啡馆午后", "公园草地", "安静房间"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
    musicSceneTags: ["Cafe Afternoon"],
    avoidWhen: ["深夜", "便利店", "机场", "地铁"],
    recommendationReason: "简单的吉他和人声，像咖啡馆里一个很慢的下午。",
    pace: "medium", lightTone: "warm", season: "all",
  },
  {
    neteaseKeyword: "小森林 陈鸿宇",
    title: "小森林",
    artist: "陈鸿宇",
    primaryMusicScene: ["Cafe Afternoon"],
    memoryTypes: ["city_park_restorative", "daily_life_home"],
    listenerEvidence: {
      language: "Mandarin", familiarityTier: "discovery", chineseListenerFit: 0.72,
      generationFit: ["95后", "00后", "独立民谣听众"],
      culturalMemory: ["中国独立民谣", "日常叙事"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["咖啡馆午后", "公园草地"],
      evidenceSource: "manual", evidenceConfidence: 0.70,
    },
    musicSceneTags: ["Cafe Afternoon"],
    avoidWhen: ["深夜", "便利店", "机场"],
    recommendationReason: "像是坐在咖啡馆角落，看窗外树叶轻轻晃。",
    pace: "slow", lightTone: "warm", season: "all",
  },
  {
    neteaseKeyword: "慢慢喜欢你 莫文蔚",
    title: "慢慢喜欢你",
    artist: "莫文蔚",
    expectedSongId: "541687281",
    primaryMusicScene: ["Cafe Afternoon", "Garden Portrait"],
    memoryTypes: ["city_park_restorative"],
    listenerEvidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["慢节奏恋爱观", "温暖治愈"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["咖啡馆午后", "公园草地", "花园肖像"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
    musicSceneTags: ["Cafe Afternoon", "Garden Portrait"],
    avoidWhen: ["深夜", "便利店", "机场", "地铁"],
    recommendationReason: "温暖的声线和慢节奏，像午后阳光透过咖啡馆玻璃窗。",
    pace: "slow", lightTone: "warm", season: "spring",
  },

  // ═══════════════════════════════════════
  // Concert Afterglow (演唱会散场)
  // ═══════════════════════════════════════
  {
    neteaseKeyword: "后来的我们 五月天",
    title: "后来的我们",
    artist: "五月天",
    primaryMusicScene: ["Concert Afterglow"],
    memoryTypes: ["night_city_dining", "campus_youth"],
    listenerEvidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.92,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["五月天演唱会", "青春散场", "集体合唱"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["演唱会散场", "校园黄昏"],
      evidenceSource: "manual", evidenceConfidence: 0.90,
    },
    musicSceneTags: ["Concert Afterglow"],
    avoidWhen: ["便利店", "机场", "酒店"],
    recommendationReason: "散场后的街道，刚才的旋律还在耳边，人群慢慢离开。",
    pace: "medium", lightTone: "warm", season: "all",
  },
  {
    neteaseKeyword: "如果我们不曾相遇 五月天",
    title: "如果我们不曾相遇",
    artist: "五月天",
    primaryMusicScene: ["Concert Afterglow"],
    memoryTypes: ["night_city_dining", "campus_youth"],
    listenerEvidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["90后", "00后"],
      culturalMemory: ["五月天演唱会终曲", "相遇与告别"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["演唱会散场", "校园黄昏"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
    musicSceneTags: ["Concert Afterglow"],
    avoidWhen: ["便利店", "机场", "酒店", "办公室"],
    recommendationReason: "适合散场后走在路上，和人群一起慢慢散开的感觉。",
    pace: "medium", lightTone: "warm", season: "all",
  },
  {
    neteaseKeyword: "我不愿让你一个人 五月天",
    title: "我不愿让你一个人",
    artist: "五月天",
    primaryMusicScene: ["Concert Afterglow"],
    memoryTypes: ["night_city_dining", "rain_window_solitude"],
    listenerEvidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["90后", "00后"],
      culturalMemory: ["五月天演唱会", "陪伴叙事"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["演唱会散场", "深夜街道"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
    musicSceneTags: ["Concert Afterglow"],
    avoidWhen: ["便利店", "机场", "办公室"],
    recommendationReason: "散场后的路灯下，人群渐渐散去，但刚才的共鸣还在。",
    pace: "medium", lightTone: "warm", season: "all",
  },

  // ═══════════════════════════════════════
  // Friends Gathering (朋友聚餐)
  // ═══════════════════════════════════════
  {
    neteaseKeyword: "干杯 五月天",
    title: "干杯",
    artist: "五月天",
    primaryMusicScene: ["Friends Gathering"],
    memoryTypes: ["night_city_dining"],
    listenerEvidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.92,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["友情经典", "聚餐必唱", "干杯仪式"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["朋友聚餐", "毕业聚餐"],
      evidenceSource: "manual", evidenceConfidence: 0.92,
    },
    musicSceneTags: ["Friends Gathering"],
    avoidWhen: ["独处", "雨夜", "酒店", "机场"],
    recommendationReason: "像朋友们举起杯子那一刻，热气腾腾的桌上，大家还没散。",
    pace: "upbeat", lightTone: "bright", season: "all",
  },
  {
    neteaseKeyword: "友情岁月 郑伊健",
    title: "友情岁月",
    artist: "郑伊健",
    primaryMusicScene: ["Friends Gathering"],
    memoryTypes: ["night_city_dining"],
    listenerEvidence: {
      language: "Cantonese", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["85后", "90后", "粤语区用户"],
      culturalMemory: ["港片友情怀旧", "KTV合唱经典"],
      likelyAudience: ["85后", "90后", "粤语用户"],
      suitableChineseScenes: ["朋友聚餐", "KTV聚会"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
    musicSceneTags: ["Friends Gathering"],
    avoidWhen: ["独处", "便利店", "机场", "酒店"],
    recommendationReason: "朋友围坐一桌，热气蒸腾，这顿饭还没到散场的时候。",
    pace: "medium", lightTone: "warm", season: "all",
  },
  {
    neteaseKeyword: "我的好兄弟 高进",
    title: "我的好兄弟",
    artist: "高进",
    primaryMusicScene: ["Friends Gathering"],
    memoryTypes: ["night_city_dining"],
    listenerEvidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["KTV兄弟经典", "聚餐必点"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["朋友聚餐", "KTV聚会"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
    musicSceneTags: ["Friends Gathering"],
    avoidWhen: ["独处", "便利店", "机场", "酒店"],
    recommendationReason: "在热气腾腾的火锅桌前，兄弟几个还没聊够。",
    pace: "medium", lightTone: "warm", season: "all",
  },
];

/**
 * Garden Portrait reclassification map.
 * Existing songs that genuinely fit garden/portrait scenes.
 */
export const gardenPortraitReclassify: Record<string, { primaryMusicScene: string[]; memoryTypes: string[] }> = {
  // These already have flower_dream_portrait as memory type
  "小情歌-苏打绿": {
    primaryMusicScene: ["Garden Portrait", "Campus Sunset"],
    memoryTypes: ["flower_dream_portrait", "campus_youth"],
  },
  "旅行的意义-陈绮贞": {
    primaryMusicScene: ["Train Window", "Airport Waiting"],
    memoryTypes: ["travel_landscape"],
  },
};
