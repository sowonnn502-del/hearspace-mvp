/**
 * Listener Evidence — Curated Chinese Audience Data
 *
 * ALL data in this file is manually maintained. Rules:
 * - "manual" = individually reviewed by maintainer
 * - "curated_rule" = derived from artist/public data patterns, reviewed
 * - "artist_familiarity" = based on artist's known market position
 *
 * NO data is AI-generated at runtime.
 * Songs with evidenceConfidence < 0.6 cannot be Top 1 recommendation.
 */

import type { ListenerEvidence } from "../lib/music-library";

type EvidenceEntry = {
  id: string;  // matches MusicSong.id
  evidence: ListenerEvidence;
};

export const listenerEvidenceMap: EvidenceEntry[] = [
  // ═══════════════════════════════════════════
  // HIGH FAMILIARITY — 华语流行经典 / 港台经典
  // Chinese youth (18-35) almost universally recognize
  // ═══════════════════════════════════════════

  // ── 周杰伦 ──
  {
    id: "晴天-周杰伦",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.95,
      generationFit: ["90后", "00后", "华语流行核心用户"],
      culturalMemory: ["华语校园青春", "千禧年代集体记忆", "放学与暗恋叙事"],
      likelyAudience: ["90后", "00后", "华语流行用户"],
      suitableChineseScenes: ["校园黄昏", "教室窗边", "毕业季"],
      evidenceSource: "manual", evidenceConfidence: 0.95,
    },
  },
  {
    id: "蒲公英的约定-周杰伦",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["90后", "00后", "华语流行核心用户"],
      culturalMemory: ["校园毕业季", "青春约定"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "毕业季", "教室"],
      evidenceSource: "manual", evidenceConfidence: 0.90,
    },
  },
  {
    id: "雨下一整晚-周杰伦",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["90后", "00后", "华语流行核心用户"],
      culturalMemory: ["雨夜情歌", "千禧年代华语流行"],
      likelyAudience: ["90后", "00后", "华语流行用户"],
      suitableChineseScenes: ["雨天窗边", "深夜房间"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "一路向北-周杰伦",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.92,
      generationFit: ["90后", "00后", "华语流行核心用户"],
      culturalMemory: ["电影配乐记忆", "公路与告别"],
      likelyAudience: ["90后", "00后", "华语流行用户"],
      suitableChineseScenes: ["高铁窗边", "机场候机", "车内夜路"],
      evidenceSource: "manual", evidenceConfidence: 0.90,
    },
  },
  {
    id: "稻香-周杰伦",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.95,
      generationFit: ["90后", "00后", "10后", "华语流行核心用户"],
      culturalMemory: ["童年回忆", "乡村与自然", "治愈力量"],
      likelyAudience: ["90后", "00后", "10后", "全年龄段"],
      suitableChineseScenes: ["公园草地", "校园黄昏", "田园空间"],
      evidenceSource: "manual", evidenceConfidence: 0.95,
    },
  },
  {
    id: "七里香-周杰伦",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.95,
      generationFit: ["90后", "00后", "华语流行核心用户"],
      culturalMemory: ["华语青春代表作", "夏季记忆", "千禧年夏日"],
      likelyAudience: ["90后", "00后", "华语流行用户"],
      suitableChineseScenes: ["校园黄昏", "夏日窗边", "公园草地"],
      evidenceSource: "manual", evidenceConfidence: 0.95,
    },
  },
  {
    id: "不能说的秘密-周杰伦",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.92,
      generationFit: ["90后", "00后", "华语流行核心用户"],
      culturalMemory: ["电影原声记忆", "校园暗恋", "钢琴与青春"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "教室窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.90,
    },
  },
  {
    id: "等你下课-周杰伦",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["90后", "00后", "华语流行核心用户"],
      culturalMemory: ["等放学叙事", "校园日常"],
      likelyAudience: ["90后", "00后", "华语流行用户"],
      suitableChineseScenes: ["校园黄昏", "公交站", "放学后"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },

  // ── 陈奕迅 ──
  {
    id: "好久不见-陈奕迅",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.92,
      generationFit: ["85后", "90后", "00后", "华语流行用户"],
      culturalMemory: ["久别重逢", "城市记忆", "深夜独处"],
      likelyAudience: ["85后", "90后", "00后", "华语流行用户"],
      suitableChineseScenes: ["深夜便利店", "地铁末班车", "老城区街巷"],
      evidenceSource: "manual", evidenceConfidence: 0.92,
    },
  },
  {
    id: "爱情转移-陈奕迅",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["电影配乐记忆", "都市情感"],
      likelyAudience: ["85后", "90后", "00后", "华语流行用户"],
      suitableChineseScenes: ["雨天窗边", "地铁末班车", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },
  {
    id: "最佳损友-陈奕迅",
    evidence: {
      language: "Cantonese", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["85后", "90后", "00后", "粤语区用户"],
      culturalMemory: ["友谊记忆", "粤语流行经典"],
      likelyAudience: ["85后", "90后", "00后", "粤语用户"],
      suitableChineseScenes: ["朋友聚餐", "演唱会散场", "老城区街巷"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "无人之境-陈奕迅",
    evidence: {
      language: "Cantonese", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["85后", "90后", "粤语区用户"],
      culturalMemory: ["粤语都市情感"],
      likelyAudience: ["85后", "90后", "粤语用户"],
      suitableChineseScenes: ["深夜便利店", "城市夜景", "酒店独处"],
      evidenceSource: "manual", evidenceConfidence: 0.80,
    },
  },
  {
    id: "孤独患者-陈奕迅",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["城市孤独感", "深夜独处"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["深夜便利店", "地铁末班车", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "富士山下-陈奕迅",
    evidence: {
      language: "Cantonese", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["85后", "90后", "00后", "粤语区用户"],
      culturalMemory: ["粤语经典情歌", "旅行记忆"],
      likelyAudience: ["85后", "90后", "00后", "粤语用户"],
      suitableChineseScenes: ["地铁末班车", "城市夜景", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },
  {
    id: "不要说话-陈奕迅",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["城市安静时刻"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["酒店独处", "深夜便利店", "办公室加班"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },
  {
    id: "让我留在你身边-陈奕迅",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["电影配乐", "城市陪伴感"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["地铁末班车", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },

  // ── 五月天 ──
  {
    id: "知足-五月天",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.93,
      generationFit: ["90后", "00后", "华语流行核心用户"],
      culturalMemory: ["青春告别", "校园毕业", "演唱会合唱"],
      likelyAudience: ["90后", "00后", "华语流行用户"],
      suitableChineseScenes: ["校园黄昏", "演唱会散场", "毕业季"],
      evidenceSource: "manual", evidenceConfidence: 0.93,
    },
  },
  {
    id: "突然好想你-五月天",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.93,
      generationFit: ["90后", "00后", "华语流行核心用户"],
      culturalMemory: ["思念与青春", "演唱会大合唱"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "地铁末班车", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.93,
    },
  },
  {
    id: "倔强-五月天",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.93,
      generationFit: ["90后", "00后", "华语流行核心用户"],
      culturalMemory: ["青年励志", "校园运动会", "毕业季"],
      likelyAudience: ["90后", "00后", "华语流行用户"],
      suitableChineseScenes: ["校园黄昏", "演唱会散场"],
      evidenceSource: "manual", evidenceConfidence: 0.93,
    },
  },

  // ── 孙燕姿 ──
  {
    id: "遇见-孙燕姿",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.92,
      generationFit: ["85后", "90后", "00后", "华语流行用户"],
      culturalMemory: ["千禧年代华语女声", "地铁与相遇", "都市感"],
      likelyAudience: ["85后", "90后", "00后", "华语流行用户"],
      suitableChineseScenes: ["地铁末班车", "雨天窗边", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.92,
    },
  },
  {
    id: "我怀念的-孙燕姿",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["85后", "90后", "00后", "华语流行用户"],
      culturalMemory: ["千禧年代情歌经典", "KTV必点"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["雨天窗边", "酒店独处"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },
  {
    id: "开始懂了-孙燕姿",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["千禧年代成长主题"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["雨天窗边", "酒店独处"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "我也很想他-孙燕姿",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.82,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["千禧年代情感记忆"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.80,
    },
  },

  // ── 王菲 ──
  {
    id: "匆匆那年-王菲",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.92,
      generationFit: ["85后", "90后", "00后", "华语流行用户"],
      culturalMemory: ["电影原声记忆", "校园青春", "毕业季"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "老城区街巷", "毕业季"],
      evidenceSource: "manual", evidenceConfidence: 0.92,
    },
  },
  {
    id: "红豆-王菲",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.93,
      generationFit: ["85后", "90后", "00后", "华语流行用户"],
      culturalMemory: ["华语经典情歌", "KTV回忆", "千禧年代"],
      likelyAudience: ["85后", "90后", "00后", "全年龄段"],
      suitableChineseScenes: ["雨天窗边", "酒店独处", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.93,
    },
  },
  {
    id: "致青春-王菲",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["电影原声", "校园记忆"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "毕业季"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },

  // ── Beyond ──
  {
    id: "海阔天空-beyond",
    evidence: {
      language: "Cantonese", familiarityTier: "high", chineseListenerFit: 0.95,
      generationFit: ["80后", "90后", "00后", "粤语区用户", "摇滚用户"],
      culturalMemory: ["粤语摇滚经典", "自由与理想", "集体KTV记忆"],
      likelyAudience: ["80后", "90后", "00后", "粤语用户"],
      suitableChineseScenes: ["海边日落", "演唱会散场", "天台夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.95,
    },
  },
  {
    id: "光辉岁月-beyond",
    evidence: {
      language: "Cantonese", familiarityTier: "high", chineseListenerFit: 0.95,
      generationFit: ["80后", "90后", "00后", "粤语区用户"],
      culturalMemory: ["粤语摇滚经典", "理想与坚持", "集体记忆"],
      likelyAudience: ["80后", "90后", "00后", "粤语用户"],
      suitableChineseScenes: ["海边日落", "演唱会散场"],
      evidenceSource: "manual", evidenceConfidence: 0.95,
    },
  },

  // ── 张学友 ──
  {
    id: "遥远的她-张学友",
    evidence: {
      language: "Cantonese", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["80后", "90后", "粤语区用户"],
      culturalMemory: ["粤语经典情歌", "KTV经典"],
      likelyAudience: ["80后", "90后", "粤语用户"],
      suitableChineseScenes: ["机场候机", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },

  // ── 刘若英 ──
  {
    id: "后来-刘若英",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.95,
      generationFit: ["85后", "90后", "00后", "全年龄段"],
      culturalMemory: ["KTV必点", "青春遗憾", "回忆杀"],
      likelyAudience: ["85后", "90后", "00后", "全年龄段"],
      suitableChineseScenes: ["老城区街巷", "校园黄昏", "演唱会散场"],
      evidenceSource: "manual", evidenceConfidence: 0.95,
    },
  },

  // ── 李宗盛 ──
  {
    id: "漂洋过海来看你-李宗盛",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["80后", "90后", "华语经典听众"],
      culturalMemory: ["华语经典情歌", "异地情感"],
      likelyAudience: ["80后", "90后", "华语经典听众"],
      suitableChineseScenes: ["机场候机", "高铁窗边", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },
  {
    id: "山丘-李宗盛",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["80后", "90后", "华语经典听众"],
      culturalMemory: ["中年感悟", "人生回顾", "华语经典"],
      likelyAudience: ["80后", "90后", "华语经典听众"],
      suitableChineseScenes: ["办公室加班", "酒店独处", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },
  {
    id: "给自己的歌-李宗盛",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.82,
      generationFit: ["80后", "90后", "华语经典听众"],
      culturalMemory: ["自我反思", "人生感悟"],
      likelyAudience: ["80后", "90后"],
      suitableChineseScenes: ["办公室加班", "酒店独处"],
      evidenceSource: "manual", evidenceConfidence: 0.80,
    },
  },
  {
    id: "凡人歌-李宗盛",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["80后", "90后", "00后", "华语经典听众"],
      culturalMemory: ["平凡人生叙事", "华语经典"],
      likelyAudience: ["80后", "90后", "00后"],
      suitableChineseScenes: ["办公室加班", "老城区街巷"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },

  // ── 朴树 ──
  {
    id: "平凡之路-朴树",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["电影原声", "公路记忆", "青春迷茫"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["高铁窗边", "海边日落", "公路旅行"],
      evidenceSource: "manual", evidenceConfidence: 0.90,
    },
  },
  {
    id: "那些花儿-朴树",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["校园毕业", "青春告别"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "毕业季", "老城区街巷"],
      evidenceSource: "manual", evidenceConfidence: 0.90,
    },
  },

  // ── 林俊杰 ──
  {
    id: "她说-林俊杰",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["华语流行情歌", "KTV常点"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["雨天窗边", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "可惜没如果-林俊杰",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["遗憾叙事", "KTV经典"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["雨天窗边", "深夜房间"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },

  // ── 张惠妹 ──
  {
    id: "解脱-张惠妹",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["KTV经典", "情感释放"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["酒店独处", "演唱会后"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },

  // ── Twins ──
  {
    id: "下一站天后-twins",
    evidence: {
      language: "Cantonese", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["90后", "00后", "粤语区用户"],
      culturalMemory: ["粤语青春偶像", "地铁记忆"],
      likelyAudience: ["90后", "00后", "粤语用户"],
      suitableChineseScenes: ["地铁末班车", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },

  // ── 莫文蔚 ──
  {
    id: "阴天-莫文蔚",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["千禧年代都市女声", "慵懒氛围"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["雨天窗边", "酒店独处", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "慢慢喜欢你-莫文蔚",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["慢节奏恋爱观", "温暖治愈"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["咖啡馆", "公园草地", "花园肖像"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },
  {
    id: "忽然之间-莫文蔚",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["地震记忆", "珍惜当下", "KTV经典"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["海边日落", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },

  // ── 陶喆 ──
  {
    id: "普通朋友-陶喆",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["R&B华语经典", "KTV必点"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["深夜便利店", "城市夜景", "朋友聚餐"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "melody-陶喆",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["华语R&B代表作", "经典情歌"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["城市夜景", "天台夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },

  // ── 梁静茹 ──
  {
    id: "会呼吸的痛-梁静茹",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["KTV情歌经典", "都市情感"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["雨天窗边", "酒店独处"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "崇拜-梁静茹",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["KTV情歌经典"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["雨天窗边", "酒店独处"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "暖暖-梁静茹",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["90后", "00后"],
      culturalMemory: ["温暖治愈", "校园回忆"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "公园草地", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "小手拉大手-梁静茹",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后"],
      culturalMemory: ["甜蜜日常", "日系翻唱"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "公园草地"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },

  // ── 张震岳 ──
  {
    id: "再见-张震岳",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["KTV告别曲", "毕业季", "旅行记忆"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["机场候机", "高铁窗边", "毕业季"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },
  {
    id: "小宇-张震岳",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["夏日恋爱", "轻松日常"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["海边日落", "公园草地"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },

  // ── 许巍 ──
  {
    id: "蓝莲花-许巍",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["80后", "90后", "00后", "摇滚用户"],
      culturalMemory: ["自由与旅行", "公路精神", "中国摇滚经典"],
      likelyAudience: ["80后", "90后", "00后"],
      suitableChineseScenes: ["高铁窗边", "海边日落", "公路旅行"],
      evidenceSource: "manual", evidenceConfidence: 0.90,
    },
  },
  {
    id: "曾经的你-许巍",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["80后", "90后", "00后"],
      culturalMemory: ["旅行精神", "摇滚经典"],
      likelyAudience: ["80后", "90后", "00后"],
      suitableChineseScenes: ["高铁窗边", "公路旅行"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },
  {
    id: "故乡-许巍",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["80后", "90后", "00后"],
      culturalMemory: ["故乡情怀", "中国摇滚"],
      likelyAudience: ["80后", "90后", "00后"],
      suitableChineseScenes: ["高铁窗边", "老城区街巷"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "旅行-许巍",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.82,
      generationFit: ["80后", "90后", "00后"],
      culturalMemory: ["旅行记忆"],
      likelyAudience: ["80后", "90后", "00后"],
      suitableChineseScenes: ["海边日落", "高铁窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.80,
    },
  },
  {
    id: "生活不止眼前的苟且-许巍",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["80后", "90后", "00后"],
      culturalMemory: ["诗意与远方"],
      likelyAudience: ["80后", "90后", "00后"],
      suitableChineseScenes: ["高铁窗边", "办公室加班"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },

  // ── Beyond, 老狼, 逃跑计划 ──
  {
    id: "同桌的你-老狼",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.92,
      generationFit: ["80后", "90后", "00后", "全年龄段"],
      culturalMemory: ["校园民谣经典", "毕业季", "同桌记忆"],
      likelyAudience: ["80后", "90后", "00后", "全年龄段"],
      suitableChineseScenes: ["校园黄昏", "毕业季", "老城区街巷"],
      evidenceSource: "manual", evidenceConfidence: 0.92,
    },
  },
  {
    id: "夜空中最亮的星-逃跑计划",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["青年励志", "综艺翻唱", "集体合唱"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["天台夜景", "演唱会散场", "深夜便利店"],
      evidenceSource: "manual", evidenceConfidence: 0.88,
    },
  },
  {
    id: "一万次悲伤-逃跑计划",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.82,
      generationFit: ["90后", "00后"],
      culturalMemory: ["摇滚情歌"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["天台夜景", "演唱会散场"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },

  // ═══════════════════════════════════════════
  // MEDIUM FAMILIARITY — 中文独立/民谣/新锐
  // Recognized by many but not universally
  // ═══════════════════════════════════════════

  // ── 陈粒 ──
  {
    id: "奇妙能力歌-陈粒",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.82,
      generationFit: ["90后", "00后", "独立音乐听众"],
      culturalMemory: ["中国独立民谣代表", "文艺青年记忆"],
      likelyAudience: ["90后", "00后", "独立音乐听众"],
      suitableChineseScenes: ["公园草地", "咖啡馆", "酒店独处"],
      evidenceSource: "manual", evidenceConfidence: 0.80,
    },
  },
  {
    id: "走马-陈粒",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["90后", "00后", "独立音乐听众"],
      culturalMemory: ["独立民谣", "文艺叙事"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["高铁窗边", "公园草地"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "小半-陈粒",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["90后", "00后", "独立音乐听众"],
      culturalMemory: ["独立流行"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["酒店独处", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },

  // ── 房东的猫 ──
  {
    id: "云烟成雨-房东的猫",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.82,
      generationFit: ["95后", "00后", "独立民谣听众"],
      culturalMemory: ["中国独立民谣新声", "治愈系"],
      likelyAudience: ["95后", "00后", "独立民谣听众"],
      suitableChineseScenes: ["雨天窗边", "公园草地", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.80,
    },
  },
  {
    id: "美好事物-房东的猫",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["95后", "00后", "独立民谣听众"],
      culturalMemory: ["治愈日常", "小清新"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["公园草地", "海边日落", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "下一站茶山刘-房东的猫",
    evidence: {
      language: "Mandarin", familiarityTier: "discovery", chineseListenerFit: 0.70,
      generationFit: ["00后", "独立民谣听众"],
      culturalMemory: ["校园民谣新声", "武汉城市记忆"],
      likelyAudience: ["00后", "独立民谣听众"],
      suitableChineseScenes: ["高铁窗边", "校园黄昏"],
      evidenceSource: "manual", evidenceConfidence: 0.70,
    },
  },

  // ── 郭顶 ──
  {
    id: "水星记-郭顶",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.82,
      generationFit: ["90后", "00后", "独立流行听众"],
      culturalMemory: ["独立R&B", "天文意象", "短视频热门"],
      likelyAudience: ["90后", "00后", "独立流行听众"],
      suitableChineseScenes: ["深夜便利店", "地铁末班车", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.80,
    },
  },
  {
    id: "凄美地-郭顶",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["90后", "00后", "独立流行听众"],
      culturalMemory: ["独立摇滚", "城市感"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["城市夜景", "地铁末班车", "天台夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },

  // ── 赵雷 ──
  {
    id: "南方姑娘-赵雷",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["90后", "00后", "民谣听众"],
      culturalMemory: ["中国民谣叙事", "城市记忆"],
      likelyAudience: ["90后", "00后", "民谣听众"],
      suitableChineseScenes: ["老城区街巷", "公园草地", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "成都-赵雷",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["城市民谣代表", "成都记忆", "综艺爆款"],
      likelyAudience: ["90后", "00后", "全年龄段"],
      suitableChineseScenes: ["老城区街巷", "公园草地", "旅行记忆"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },

  // ── 毛不易 ──
  {
    id: "平凡的一天-毛不易",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.82,
      generationFit: ["95后", "00后", "华语流行用户"],
      culturalMemory: ["选秀出身", "日常叙事", "治愈系"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["公园草地", "咖啡馆", "办公室加班"],
      evidenceSource: "manual", evidenceConfidence: 0.80,
    },
  },
  {
    id: "消愁-毛不易",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["95后", "00后", "华语流行用户"],
      culturalMemory: ["选秀爆款", "酒桌叙事", "综艺记忆"],
      likelyAudience: ["95后", "00后", "华语流行用户"],
      suitableChineseScenes: ["办公室加班", "深夜便利店", "酒店独处"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "像我这样的人-毛不易",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["95后", "00后", "华语流行用户"],
      culturalMemory: ["选秀代表作", "自嘲叙事"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["办公室加班", "深夜便利店"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },

  // ── 陈绮贞 ──
  {
    id: "旅行的意义-陈绮贞",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["85后", "90后", "00后", "文艺青年"],
      culturalMemory: ["台湾独立音乐代表", "旅行文艺叙事", "文艺青年入门曲"],
      likelyAudience: ["85后", "90后", "00后", "文艺青年"],
      suitableChineseScenes: ["高铁窗边", "机场候机", "海边日落"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "还是会寂寞-陈绮贞",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["85后", "90后", "文艺青年"],
      culturalMemory: ["台湾独立音乐", "小清新"],
      likelyAudience: ["85后", "90后", "文艺青年"],
      suitableChineseScenes: ["酒店独处", "雨天窗边", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.75,
    },
  },

  // ── 苏打绿 ──
  {
    id: "小情歌-苏打绿",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["台湾独立流行代表", "KTV经典"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "公园草地", "花园肖像"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "无与伦比的美丽-苏打绿",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后"],
      culturalMemory: ["友情叙事", "台湾独立流行"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["海边日落", "公园草地", "演唱会散场"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },

  // ── 蔡健雅 ──
  {
    id: "别找我麻烦-蔡健雅",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["都市轻快叙事"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["深夜便利店", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "空白格-蔡健雅",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["都市情感", "KTV经典"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["地铁末班车", "雨天窗边", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "红色高跟鞋-蔡健雅",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后"],
      culturalMemory: ["都市女性叙事", "短视频热门"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["城市夜景", "朋友聚餐"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },
  {
    id: "记念-蔡健雅",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["都市情感"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["城市夜景", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.75,
    },
  },
  {
    id: "达尔文-蔡健雅",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["进化叙事", "都市感悟"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["办公室加班", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },

  // ── 徐佳莹 ──
  {
    id: "身骑白马-徐佳莹",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["选秀出道", "闽南语元素", "中国风融合"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["城市夜景", "深夜便利店"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },
  {
    id: "失落沙洲-徐佳莹",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["90后", "00后"],
      culturalMemory: ["选秀代表作", "情感叙事"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["地铁末班车", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },

  // ── 梁博 ──
  {
    id: "日落大道-梁博",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["90后", "00后", "摇滚听众"],
      culturalMemory: ["选秀冠军", "公路摇滚"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["城市夜景", "天台夜景", "深夜便利店"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "男孩-梁博",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["90后", "00后"],
      culturalMemory: ["选秀代表作", "成长叙事"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["城市夜景", "天台夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },

  // ── 其他 medium ──
  {
    id: "那些年-胡夏",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["90后", "00后"],
      culturalMemory: ["电影原声", "校园青春", "毕业季标配"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "毕业季", "老城区街巷"],
      evidenceSource: "manual", evidenceConfidence: 0.90,
    },
  },
  {
    id: "春风十里-鹿先森乐队",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["90后", "00后", "民谣听众"],
      culturalMemory: ["中国民谣新声", "春天叙事"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["公园草地", "咖啡馆", "老城区街巷"],
      evidenceSource: "manual", evidenceConfidence: 0.75,
    },
  },
  {
    id: "生活倒影-苏运莹",
    evidence: {
      language: "Mandarin", familiarityTier: "discovery", chineseListenerFit: 0.70,
      generationFit: ["95后", "00后", "独立流行听众"],
      culturalMemory: ["独立女声", "独特唱腔"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["公园草地", "海边日落"],
      evidenceSource: "manual", evidenceConfidence: 0.68,
    },
  },
  {
    id: "爱人错过-告五人",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["95后", "00后", "独立流行听众"],
      culturalMemory: ["台湾独立新声", "短视频热门"],
      likelyAudience: ["95后", "00后", "独立音乐听众"],
      suitableChineseScenes: ["深夜便利店", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "披星戴月的想你-告五人",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["95后", "00后", "独立流行听众"],
      culturalMemory: ["台湾独立新声", "浪漫叙事"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["深夜便利店", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.75,
    },
  },
  {
    id: "浪费-林宥嘉",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["台湾流行", "情感叙事"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["深夜便利店", "地铁末班车", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "说谎-林宥嘉",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["KTV经典", "台湾流行代表作"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["公交站", "深夜便利店", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "你要的爱-戴佩妮",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["台湾偶像剧记忆"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["雨天窗边", "深夜便利店"],
      evidenceSource: "manual", evidenceConfidence: 0.75,
    },
  },
  {
    id: "寂寞烟火-蓝心羽",
    evidence: {
      language: "Mandarin", familiarityTier: "discovery", chineseListenerFit: 0.65,
      generationFit: ["00后", "网络音乐听众"],
      culturalMemory: ["网络翻唱时代"],
      likelyAudience: ["00后"],
      suitableChineseScenes: ["深夜便利店", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.60,
    },
  },
  {
    id: "晚安晚安-魏如萱",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.75,
      generationFit: ["90后", "00后", "独立音乐听众"],
      culturalMemory: ["台湾独立女声"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["深夜便利店", "酒店独处"],
      evidenceSource: "manual", evidenceConfidence: 0.72,
    },
  },
  {
    id: "可乐-赵紫骅",
    evidence: {
      language: "Mandarin", familiarityTier: "discovery", chineseListenerFit: 0.65,
      generationFit: ["00后", "网络音乐听众"],
      culturalMemory: ["网络热歌"],
      likelyAudience: ["00后"],
      suitableChineseScenes: ["深夜便利店", "公交站"],
      evidenceSource: "manual", evidenceConfidence: 0.60,
    },
  },
  {
    id: "路过人间-郁可唯",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["90后", "00后"],
      culturalMemory: ["OST歌手", "人生感悟"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["机场候机", "高铁窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "你就不要想起我-田馥甄",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["台湾流行女声", "KTV经典"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["地铁末班车", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },
  {
    id: "小幸运-田馥甄",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.90,
      generationFit: ["90后", "00后", "华语流行用户"],
      culturalMemory: ["电影原声爆款", "校园青春", "KTV必点"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["校园黄昏", "毕业季"],
      evidenceSource: "manual", evidenceConfidence: 0.90,
    },
  },
  {
    id: "寂寞寂寞就好-田馥甄",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后"],
      culturalMemory: ["台湾流行", "都市情感"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["酒店独处", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },
  {
    id: "房间-刘瑞琦",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.75,
      generationFit: ["95后", "00后"],
      culturalMemory: ["翻唱起家", "房间叙事"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["酒店独处", "房间空间"],
      evidenceSource: "manual", evidenceConfidence: 0.72,
    },
  },
  {
    id: "地下铁-萧亚轩",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["千禧年代都市流行", "地铁叙事"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["地铁末班车", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.75,
    },
  },
  {
    id: "起风了-买辣椒也用券",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["95后", "00后", "网络音乐用户"],
      culturalMemory: ["网络翻唱爆款", "短视频热门", "日文原曲翻唱"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["海边日落", "高铁窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },
  {
    id: "如果有来生-谭维维",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["90后", "00后"],
      culturalMemory: ["民谣叙事", "综艺翻唱"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["海边日落", "公园草地"],
      evidenceSource: "manual", evidenceConfidence: 0.75,
    },
  },
  {
    id: "夏日漱石-橘子海",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["95后", "00后", "独立流行听众"],
      culturalMemory: ["中国City Pop新声", "夏日感"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["海边日落", "高铁窗边", "城市自行车道"],
      evidenceSource: "manual", evidenceConfidence: 0.75,
    },
  },
  {
    id: "有暖气-橘子海",
    evidence: {
      language: "Mandarin", familiarityTier: "discovery", chineseListenerFit: 0.68,
      generationFit: ["95后", "00后", "独立流行听众"],
      culturalMemory: ["中国City Pop"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["海边日落", "城市夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.65,
    },
  },
  {
    id: "想去海边-夏日入侵企画",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.80,
      generationFit: ["95后", "00后", "独立摇滚听众"],
      culturalMemory: ["中国独立摇滚新声", "夏日旅行"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["海边日落", "高铁窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "雨爱-杨丞琳",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后"],
      culturalMemory: ["台湾偶像剧记忆", "雨景叙事"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["雨天窗边", "公交站"],
      evidenceSource: "manual", evidenceConfidence: 0.82,
    },
  },
  {
    id: "倒带-蔡依林",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.88,
      generationFit: ["85后", "90后", "00后"],
      culturalMemory: ["KTV经典", "千禧年代流行"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["城市夜景", "雨天窗边"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },

  // ═══════════════════════════════════════════
  // DISCOVERY — 小众但空间匹配好
  // ═══════════════════════════════════════════

  {
    id: "去大理-郝云",
    evidence: {
      language: "Mandarin", familiarityTier: "discovery", chineseListenerFit: 0.70,
      generationFit: ["90后", "民谣听众"],
      culturalMemory: ["旅行民谣", "大理旅行记忆"],
      likelyAudience: ["90后", "民谣听众"],
      suitableChineseScenes: ["高铁窗边", "海边日落"],
      evidenceSource: "manual", evidenceConfidence: 0.68,
    },
  },
  {
    id: "远在北方孤独的鬼-花粥",
    evidence: {
      language: "Mandarin", familiarityTier: "discovery", chineseListenerFit: 0.62,
      generationFit: ["95后", "00后", "独立民谣听众"],
      culturalMemory: ["独立民谣", "网络音乐时代"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["高铁窗边", "公园草地"],
      evidenceSource: "manual", evidenceConfidence: 0.60,
    },
  },
  {
    id: "安和桥-宋冬野",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["90后", "00后", "民谣听众"],
      culturalMemory: ["中国民谣代表作", "北京城市记忆"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["高铁窗边", "老城区街巷", "天台夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "南山南-马頔",
    evidence: {
      language: "Mandarin", familiarityTier: "high", chineseListenerFit: 0.85,
      generationFit: ["90后", "00后"],
      culturalMemory: ["中国民谣爆款", "综艺翻唱"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["高铁窗边", "老城区街巷", "天台夜景"],
      evidenceSource: "manual", evidenceConfidence: 0.85,
    },
  },
  {
    id: "董小姐-宋冬野",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["90后", "00后", "民谣听众"],
      culturalMemory: ["中国民谣叙事", "选秀翻唱"],
      likelyAudience: ["90后", "00后"],
      suitableChineseScenes: ["公园草地", "老城区街巷", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.78,
    },
  },
  {
    id: "理想三旬-陈鸿宇",
    evidence: {
      language: "Mandarin", familiarityTier: "discovery", chineseListenerFit: 0.70,
      generationFit: ["90后", "00后", "民谣听众"],
      culturalMemory: ["中国独立民谣新声", "理想叙事"],
      likelyAudience: ["90后", "00后", "民谣听众"],
      suitableChineseScenes: ["公园草地", "咖啡馆", "老城区街巷"],
      evidenceSource: "manual", evidenceConfidence: 0.68,
    },
  },
  {
    id: "岁月神偷-金玟岐",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.78,
      generationFit: ["95后", "00后"],
      culturalMemory: ["电影原声", "时间叙事"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["公园草地", "老城区街巷", "咖啡馆"],
      evidenceSource: "manual", evidenceConfidence: 0.75,
    },
  },
  {
    id: "我们的明天-鹿晗",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.75,
      generationFit: ["95后", "00后", "流行偶像听众"],
      culturalMemory: ["偶像流行", "电影原声"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["校园黄昏", "公园草地"],
      evidenceSource: "manual", evidenceConfidence: 0.72,
    },
  },
  {
    id: "贝加尔湖畔-李健",
    evidence: {
      language: "Mandarin", familiarityTier: "medium", chineseListenerFit: 0.82,
      generationFit: ["85后", "90后", "00后", "文艺听众"],
      culturalMemory: ["综艺翻唱经典", "诗意叙事"],
      likelyAudience: ["85后", "90后", "00后"],
      suitableChineseScenes: ["老城区街巷", "公园草地", "湖边"],
      evidenceSource: "manual", evidenceConfidence: 0.80,
    },
  },

  // ── 琵琶语/繁花 ──
  {
    id: "琵琶语-林海",
    evidence: {
      language: "Instrumental", familiarityTier: "medium", chineseListenerFit: 0.75,
      generationFit: ["85后", "90后", "文艺听众"],
      culturalMemory: ["中国电影配乐", "琵琶与现代融合", "东方美学"],
      likelyAudience: ["85后", "90后", "文艺听众"],
      suitableChineseScenes: ["寺庙庭院", "中国园林", "安静茶室"],
      evidenceSource: "manual", evidenceConfidence: 0.75,
    },
  },
  {
    id: "繁花-陈致逸",
    evidence: {
      language: "Instrumental", familiarityTier: "discovery", chineseListenerFit: 0.65,
      generationFit: ["95后", "00后", "游戏音乐听众"],
      culturalMemory: ["游戏配乐", "东方意境"],
      likelyAudience: ["95后", "00后"],
      suitableChineseScenes: ["寺庙庭院", "中国园林"],
      evidenceSource: "manual", evidenceConfidence: 0.62,
    },
  },
];

/**
 * Look up listenerEvidence by song id.
 * Returns undefined if no evidence exists for this song.
 */
export function getListenerEvidence(id: string): ListenerEvidence | undefined {
  return listenerEvidenceMap.find((entry) => entry.id === id)?.evidence;
}
