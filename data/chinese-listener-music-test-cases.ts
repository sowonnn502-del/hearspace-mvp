/**
 * Chinese Listener Music Test Cases
 *
 * 30 real-world scenarios for Chinese youth (18-35) photo spaces.
 * Each case defines the expected cultural constraints for music recommendations.
 *
 * Hard rules:
 * - Top 3 should contain at least 1 familiar, 1 medium, 1 discovery (when 3+ available)
 * - Scene-fit takes priority over familiarity
 * - Tags must NEVER appear as song names
 * - Foreign-language songs should not dominate Top 3
 */

export type ChineseListenerTestCase = {
  id: string;
  label: string;
  description: string;
  /** Simulated photo context */
  photoEvidence: {
    scene: string;
    visibleElements: string[];
    lighting: string;
    colorTone: string;
    activity: string;
    atmosphereEvidence: string[];
  };
  /** Expected taxonomy tags */
  expectedTags: {
    spaceTags: string[];
    sceneTags: string[];
    timeTags: string[];
    socialContextTags: string[];
    visualTags: string[];
    atmosphereTags: string[];
    emotionTags: string[];
  };
  /** Cultural constraints for recommendations */
  acceptableCultures: string[];
  preferredLanguages: string[];
  forbiddenCultures: string[];
  minimumChineseListenerFit: number;
  expectedFamiliarityMix: {
    familiar: number;    // high familiarity tier
    medium: number;      // medium familiarity tier
    discovery: number;   // discovery/niche tier
  };
  /** Music scenes that MUST NOT appear */
  forbiddenMusicScenes: string[];
  /** Hard restrictions on what should never happen */
  assertions: {
    noTagAsSong: boolean;
    noForeignDomination: boolean;
    noOverGeneric: boolean;
    noCulturalConflict: boolean;
    sceneMatchRequired: boolean;
  };
};

export const chineseListenerTestCases: ChineseListenerTestCase[] = [
  // ─── 1. Campus Sunset ───
  {
    id: "campus-sunset",
    label: "校园黄昏",
    description: "大学校园黄昏，操场空无一人，夕阳透过梧桐树，刚下课的感觉",
    photoEvidence: {
      scene: "大学校园操场",
      visibleElements: ["操场", "跑道", "梧桐树", "夕阳", "书包", "空看台"],
      lighting: "黄昏暖光",
      colorTone: "暖金色",
      activity: "刚下课，无人",
      atmosphereEvidence: ["空操场", "夕阳", "梧桐树影", "暖光"],
    },
    expectedTags: {
      spaceTags: ["Campus Space", "Solitude Space"],
      sceneTags: ["Playground", "After School"],
      timeTags: ["After School", "Golden Hour"],
      socialContextTags: ["Alone", "Daily Ritual"],
      visualTags: ["Sunset", "Golden Hour", "Warm Light", "Green Shadow"],
      atmosphereTags: ["Warm Light", "Quiet", "Nostalgic"],
      emotionTags: ["Youth", "Nostalgic", "Bittersweet", "Warm"],
    },
    acceptableCultures: ["Mandopop Youth", "Chinese Indie", "Campus Folk"],
    preferredLanguages: ["Mandarin"],
    forbiddenCultures: ["Japanese City Pop", "Korean Indie", "Western Pop"],
    minimumChineseListenerFit: 0.65,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Late Night Convenience Store",
      "Airport Waiting",
      "Hotel Room",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 2. Spring Garden Portrait ───
  {
    id: "spring-garden-portrait",
    label: "春日花园肖像",
    description: "粉色玫瑰花园中，穿黄色薄纱裙的人物肖像，午后柔光，偏精致商业摄影",
    photoEvidence: {
      scene: "玫瑰花园",
      visibleElements: ["粉色玫瑰", "花园", "黄色纱裙", "柔光", "肖像人物"],
      lighting: "午后柔光",
      colorTone: "粉色、暖黄",
      activity: "被拍摄中",
      atmosphereEvidence: ["玫瑰", "柔光", "纱裙", "花园"],
    },
    expectedTags: {
      spaceTags: ["Natural Space"],
      sceneTags: ["Garden"],
      timeTags: ["Afternoon"],
      socialContextTags: ["Being Photographed", "Portrait"],
      visualTags: ["Pink Bloom", "Soft Focus", "Warm Light"],
      atmosphereTags: ["Soft Focus", "Dreamy", "Warm Light", "Slow Afternoon"],
      emotionTags: ["Romantic", "Dreamy", "Soft", "Warm"],
    },
    acceptableCultures: ["Mandopop", "Chinese Indie", "Soft Pop", "Taiwan Indie"],
    preferredLanguages: ["Mandarin"],
    forbiddenCultures: ["Japanese Pure Music", "Western Classical", "Korean Pop"],
    minimumChineseListenerFit: 0.65,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Late Night Convenience Store",
      "Subway / Empty Metro",
      "Bus Stop",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: false,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 3. Shenzhen Night View ───
  {
    id: "shenzhen-city-night",
    label: "深圳城市夜景",
    description: "深圳CBD夜景，写字楼灯光、远处车流、天桥、现代化都市",
    photoEvidence: {
      scene: "城市CBD夜景",
      visibleElements: ["写字楼", "灯光", "天桥", "车流", "霓虹"],
      lighting: "夜晚城市灯光",
      colorTone: "蓝黑、暖黄灯光",
      activity: "城市车流、无行人",
      atmosphereEvidence: ["写字楼灯光", "天桥", "车流", "夜景"],
    },
    expectedTags: {
      spaceTags: ["Urban Space"],
      sceneTags: ["Night Street", "Rooftop"],
      timeTags: ["Late Night", "Blue Hour"],
      socialContextTags: ["Alone", "Passing Through"],
      visualTags: ["Neon", "Blue Hour", "Low Light"],
      atmosphereTags: ["City Night", "Quiet", "Nostalgic"],
      emotionTags: ["Lonely", "Free", "Quiet", "Nostalgic"],
    },
    acceptableCultures: ["Chinese Indie", "City Pop", "Mandopop", "Cantopop"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    forbiddenCultures: ["Japanese Pure Music", "Korean Indie"],
    minimumChineseListenerFit: 0.6,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 4. Late Night Convenience Store ───
  {
    id: "late-night-convenience-store",
    label: "深夜便利店",
    description: "深夜24小时便利店，白光灯管，一个人站在货架前，外面是空荡的街道",
    photoEvidence: {
      scene: "便利店",
      visibleElements: ["货架", "白灯光", "冷柜", "玻璃门", "街道夜景"],
      lighting: "白荧光灯",
      colorTone: "冷白、蓝调",
      activity: "独自购物",
      atmosphereEvidence: ["白灯光", "空街道", "冷柜", "深夜"],
    },
    expectedTags: {
      spaceTags: ["Urban Space", "Commercial Space", "Solitude Space"],
      sceneTags: ["Convenience Store"],
      timeTags: ["Late Night"],
      socialContextTags: ["Alone", "Passing Through"],
      visualTags: ["Fluorescent Light", "Low Light", "Blue Hour"],
      atmosphereTags: ["City Night", "Lonely", "Quiet"],
      emotionTags: ["Lonely", "Quiet", "Free"],
    },
    acceptableCultures: ["Chinese Indie", "City Pop", "Hong Kong Night", "Mandopop"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    forbiddenCultures: ["Japanese Pure Music", "Western Folk"],
    minimumChineseListenerFit: 0.55,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 5. Rainy Window ───
  {
    id: "rainy-window",
    label: "雨天窗边",
    description: "下雨天，透过玻璃窗看外面的街道，水痕在玻璃上，房间昏暗",
    photoEvidence: {
      scene: "房间窗边",
      visibleElements: ["玻璃窗", "雨痕", "街道", "路灯", "昏暗房间"],
      lighting: "阴天暗光",
      colorTone: "灰蓝、冷色",
      activity: "独处看雨",
      atmosphereEvidence: ["雨痕", "玻璃", "暗光", "路灯"],
    },
    expectedTags: {
      spaceTags: ["Residential Space", "Solitude Space"],
      sceneTags: ["Window", "Room"],
      timeTags: ["After Rain"],
      socialContextTags: ["Alone"],
      visualTags: ["Rainy", "Window Light", "Low Light"],
      atmosphereTags: ["Rainy", "After Rain", "Quiet", "Lonely"],
      emotionTags: ["Lonely", "Melancholy", "Quiet", "Healing"],
    },
    acceptableCultures: ["Mandopop", "Chinese Indie", "Cantopop Slow"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    forbiddenCultures: ["Japanese Pure Music", "Korean Pop", "Western Pop"],
    minimumChineseListenerFit: 0.6,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Campus Sunset",
      "Late Night Convenience Store",
      "Park Grass / Bench",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 6. High-Speed Train Window ───
  {
    id: "highspeed-train-window",
    label: "高铁窗边",
    description: "高铁靠窗座位，窗外是飞驰的田野和远山，阳光透过玻璃，耳机在耳朵里",
    photoEvidence: {
      scene: "高铁车厢",
      visibleElements: ["车窗", "田野", "远山", "阳光", "座椅", "耳机"],
      lighting: "午后阳光",
      colorTone: "暖黄、绿色田野",
      activity: "坐车看风景",
      atmosphereEvidence: ["车窗", "田野", "阳光", "耳机"],
    },
    expectedTags: {
      spaceTags: ["Transit Space", "Travel Space"],
      sceneTags: ["Train Window"],
      timeTags: ["Afternoon"],
      socialContextTags: ["Passing Through", "Alone"],
      visualTags: ["Window Light", "Golden Hour", "Green Shadow"],
      atmosphereTags: ["Warm Light", "Quiet", "Slow Afternoon"],
      emotionTags: ["Free", "Quiet", "Nostalgic", "Dreamy"],
    },
    acceptableCultures: ["Chinese Indie", "Mandopop", "Travel Folk"],
    preferredLanguages: ["Mandarin"],
    forbiddenCultures: ["Japanese City Pop", "Korean Pop", "Western EDM"],
    minimumChineseListenerFit: 0.6,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Late Night Convenience Store",
      "Hotel Room",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 7. Last Metro ───
  {
    id: "last-metro",
    label: "地铁末班车",
    description: "深夜地铁末班车，车厢几乎没人，白炽灯光，窗户映出空荡的车厢",
    photoEvidence: {
      scene: "地铁车厢",
      visibleElements: ["空座位", "扶手", "白灯光", "车窗", "地铁站台"],
      lighting: "白荧光灯",
      colorTone: "冷白、金属灰",
      activity: "独自乘车",
      atmosphereEvidence: ["空车厢", "白灯光", "车窗反射", "深夜"],
    },
    expectedTags: {
      spaceTags: ["Transit Space", "Urban Space", "Solitude Space"],
      sceneTags: ["Subway"],
      timeTags: ["Late Night"],
      socialContextTags: ["Alone", "Waiting"],
      visualTags: ["Low Light", "Blue Hour"],
      atmosphereTags: ["City Night", "Lonely", "Quiet"],
      emotionTags: ["Lonely", "Quiet", "Free", "Melancholy"],
    },
    acceptableCultures: ["Chinese Indie", "City Pop", "Cantopop"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    forbiddenCultures: ["Japanese Pure Music", "Western Classical"],
    minimumChineseListenerFit: 0.55,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 8. Airport Waiting ───
  {
    id: "airport-waiting",
    label: "机场候机",
    description: "机场候机大厅，透过大玻璃窗看停机坪和跑道灯，凌晨或深夜",
    photoEvidence: {
      scene: "机场候机厅",
      visibleElements: ["大玻璃窗", "停机坪", "跑道灯", "座椅", "行李箱"],
      lighting: "凌晨/深夜暗光",
      colorTone: "灰蓝、冷白",
      activity: "等待登机",
      atmosphereEvidence: ["玻璃窗", "停机坪", "跑道灯", "深夜"],
    },
    expectedTags: {
      spaceTags: ["Transit Space", "Travel Space", "Solitude Space"],
      sceneTags: ["Airport Waiting"],
      timeTags: ["Late Night"],
      socialContextTags: ["Waiting", "Passing Through"],
      visualTags: ["Low Light", "Blue Hour", "Muted Color"],
      atmosphereTags: ["Quiet", "Lonely", "City Night"],
      emotionTags: ["Lonely", "Free", "Waiting", "Bittersweet"],
    },
    acceptableCultures: ["Mandopop", "Chinese Indie", "Travel Folk"],
    preferredLanguages: ["Mandarin"],
    forbiddenCultures: ["Japanese Pure Music", "Korean Indie", "Western Pop"],
    minimumChineseListenerFit: 0.6,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 9. Hotel Alone ───
  {
    id: "hotel-alone",
    label: "酒店独处",
    description: "商务酒店房间，一个人坐在床边看窗外城市灯光，床头灯亮着",
    photoEvidence: {
      scene: "酒店房间",
      visibleElements: ["床", "床头灯", "窗外城市灯光", "行李箱", "书桌"],
      lighting: "暗光、暖灯",
      colorTone: "暖暗、城市灯光",
      activity: "独处休息",
      atmosphereEvidence: ["床头灯", "窗外城市", "暗光", "独处"],
    },
    expectedTags: {
      spaceTags: ["Travel Space", "Commercial Space", "Solitude Space"],
      sceneTags: ["Hotel", "Room", "Window"],
      timeTags: ["Late Night"],
      socialContextTags: ["Temporary Stay", "Alone"],
      visualTags: ["Warm Light", "Low Light", "Blue Hour"],
      atmosphereTags: ["Quiet", "Lonely", "City Night"],
      emotionTags: ["Lonely", "Quiet", "Tender", "Nostalgic"],
    },
    acceptableCultures: ["Mandopop", "Chinese Indie", "City Pop"],
    preferredLanguages: ["Mandarin"],
    forbiddenCultures: ["Japanese Pure Music", "Korean Pop", "Western EDM"],
    minimumChineseListenerFit: 0.6,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Campus Sunset",
      "Park Grass / Bench",
      "Garden",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 10. Seaside Sunset ───
  {
    id: "seaside-sunset",
    label: "海边日落",
    description: "海边日落时分，海浪轻拍沙滩，橘红色天空，远处有几只船",
    photoEvidence: {
      scene: "海边沙滩",
      visibleElements: ["海", "沙滩", "日落", "船", "波浪", "贝壳"],
      lighting: "日落暖光",
      colorTone: "橘红、金黄、蓝灰",
      activity: "看海、散步",
      atmosphereEvidence: ["日落", "海浪", "沙滩", "暖光"],
    },
    expectedTags: {
      spaceTags: ["Travel Space", "Natural Space"],
      sceneTags: ["Road Trip Sunset", "Lakeside"],
      timeTags: ["Golden Hour"],
      socialContextTags: ["Passing Through"],
      visualTags: ["Sunset", "Water Reflection", "Golden Hour"],
      atmosphereTags: ["Sunset", "Dreamy", "Quiet"],
      emotionTags: ["Free", "Dreamy", "Romantic", "Nostalgic"],
    },
    acceptableCultures: ["Chinese Indie", "Mandopop", "Travel Folk"],
    preferredLanguages: ["Mandarin"],
    forbiddenCultures: ["Japanese Pure Music", "Western Classical", "Korean Pop"],
    minimumChineseListenerFit: 0.6,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Late Night Convenience Store",
      "Subway / Empty Metro",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 11. Old Neighborhood Alley ───
  {
    id: "old-neighborhood-alley",
    label: "老城区街巷",
    description: "老城区狭窄街巷，晾晒的衣服、老式自行车、下午阳光、红色砖墙",
    photoEvidence: {
      scene: "老城区小巷",
      visibleElements: ["晾衣架", "老自行车", "红砖墙", "阳光", "巷子"],
      lighting: "午后阳光",
      colorTone: "暖黄、砖红",
      activity: "日常穿行",
      atmosphereEvidence: ["晾晒衣物", "阳光", "红砖", "窄巷"],
    },
    expectedTags: {
      spaceTags: ["Urban Space", "Residential Space"],
      sceneTags: ["Night Street"],
      timeTags: ["Afternoon"],
      socialContextTags: ["Daily Ritual"],
      visualTags: ["Warm Light", "Golden Hour", "Muted Color"],
      atmosphereTags: ["Warm Light", "Nostalgic", "Slow Afternoon"],
      emotionTags: ["Nostalgic", "Warm", "Quiet", "Tender"],
    },
    acceptableCultures: ["Chinese Indie", "Mandopop", "Cantopop Classic"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    forbiddenCultures: ["Japanese City Pop", "Korean Pop", "Western Pop"],
    minimumChineseListenerFit: 0.65,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Late Night Convenience Store",
      "Airport Waiting",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 12. Park Grass ───
  {
    id: "park-grass",
    label: "公园草地",
    description: "城市公园下午，草地树荫下，有人躺着看书，远处有人遛狗",
    photoEvidence: {
      scene: "城市公园草地",
      visibleElements: ["草地", "树荫", "阳光", "长椅", "散步的人"],
      lighting: "午后阳光",
      colorTone: "绿色、暖黄",
      activity: "休息、阅读、散步",
      atmosphereEvidence: ["树荫", "草地", "阳光", "安静"],
    },
    expectedTags: {
      spaceTags: ["Natural Space", "Urban Space"],
      sceneTags: ["Park"],
      timeTags: ["Afternoon"],
      socialContextTags: ["Daily Ritual"],
      visualTags: ["Green Shadow", "Warm Light"],
      atmosphereTags: ["Warm Light", "Quiet", "Healing", "Slow Afternoon"],
      emotionTags: ["Healing", "Quiet", "Restorative", "Warm"],
    },
    acceptableCultures: ["Chinese Indie", "Folk", "Mandopop Light"],
    preferredLanguages: ["Mandarin"],
    forbiddenCultures: ["Japanese City Pop", "Korean Pop", "Western EDM"],
    minimumChineseListenerFit: 0.6,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Late Night Convenience Store",
      "Subway / Empty Metro",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 13. Cafe ───
  {
    id: "cafe-window",
    label: "咖啡馆",
    description: "独立咖啡馆靠窗座位，木质桌子、一杯拿铁、外面是街道，午后",
    photoEvidence: {
      scene: "咖啡馆",
      visibleElements: ["咖啡杯", "木桌", "玻璃窗", "街景", "拿铁", "书本"],
      lighting: "午后自然光",
      colorTone: "暖棕、柔白",
      activity: "喝咖啡、阅读",
      atmosphereEvidence: ["咖啡", "木桌", "玻璃窗", "午后光"],
    },
    expectedTags: {
      spaceTags: ["Commercial Space", "Residential Space"],
      sceneTags: ["Cafe", "Window"],
      timeTags: ["Afternoon"],
      socialContextTags: ["Alone", "Daily Ritual"],
      visualTags: ["Warm Light", "Window Light", "Soft Focus"],
      atmosphereTags: ["Warm Light", "Quiet", "Slow Afternoon"],
      emotionTags: ["Quiet", "Warm", "Healing", "Tender"],
    },
    acceptableCultures: ["Chinese Indie", "Folk", "Mandopop Light", "Taiwan Indie"],
    preferredLanguages: ["Mandarin"],
    forbiddenCultures: ["Japanese Pure Music", "Korean Pop", "Western EDM"],
    minimumChineseListenerFit: 0.6,
    expectedFamiliarityMix: { familiar: 1, medium: 1, discovery: 1 },
    forbiddenMusicScenes: [
      "Late Night Convenience Store",
      "Subway / Empty Metro",
      "Bus Stop",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: true,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 14. Friends Dinner ───
  {
    id: "friends-dinner",
    label: "朋友聚餐",
    description: "几个朋友围坐在火锅桌前，热气腾腾，灯光温暖，有说有笑",
    photoEvidence: {
      scene: "火锅餐厅",
      visibleElements: ["火锅", "餐具", "灯光", "朋友围坐", "热气"],
      lighting: "暖色灯光",
      colorTone: "暖红、金黄",
      activity: "聚餐聊天",
      atmosphereEvidence: ["热气", "暖灯", "围坐", "食物"],
    },
    expectedTags: {
      spaceTags: ["Commercial Space", "Urban Space"],
      sceneTags: ["Restaurant"],
      timeTags: ["Night"],
      socialContextTags: ["Friends Gathering"],
      visualTags: ["Warm Light", "Soft Focus"],
      atmosphereTags: ["Warm Light", "City Night"],
      emotionTags: ["Warm", "Youth", "Healing", "Free"],
    },
    acceptableCultures: ["Mandopop", "Cantopop", "Chinese Indie", "City Pop"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    forbiddenCultures: ["Japanese Pure Music", "Korean Indie"],
    minimumChineseListenerFit: 0.6,
    expectedFamiliarityMix: { familiar: 2, medium: 1, discovery: 0 },
    forbiddenMusicScenes: [
      "Rainy Window",
      "Bus Stop",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: false,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },

  // ─── 15. Concert Aftermath ───
  {
    id: "concert-aftermath",
    label: "演唱会散场",
    description: "演唱会场馆外，人群正在散去，路灯下的人们、地面上的票根和荧光棒",
    photoEvidence: {
      scene: "演唱会场馆外",
      visibleElements: ["人群", "路灯", "荧光棒", "票根", "场馆大门"],
      lighting: "夜晚路灯",
      colorTone: "暗色、灯光亮点",
      activity: "散场离开",
      atmosphereEvidence: ["人群散场", "路灯", "荧光棒", "夜晚"],
    },
    expectedTags: {
      spaceTags: ["Urban Space", "Commercial Space"],
      sceneTags: ["Night Street"],
      timeTags: ["Late Night"],
      socialContextTags: ["Farewell", "Passing Through"],
      visualTags: ["Low Light", "Blue Hour"],
      atmosphereTags: ["City Night", "Nostalgic"],
      emotionTags: ["Bittersweet", "Youth", "Free", "Nostalgic"],
    },
    acceptableCultures: ["Mandopop", "Chinese Indie", "Cantopop", "Taiwan Rock"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    forbiddenCultures: ["Japanese Pure Music", "Western Classical"],
    minimumChineseListenerFit: 0.65,
    expectedFamiliarityMix: { familiar: 2, medium: 1, discovery: 0 },
    forbiddenMusicScenes: [
      "Park Grass / Bench",
      "Garden",
    ],
    assertions: {
      noTagAsSong: true,
      noForeignDomination: true,
      noOverGeneric: false,
      noCulturalConflict: true,
      sceneMatchRequired: true,
    },
  },
];

/**
 * Additional test scenarios (16-30) — shorter form.
 * Each follows the same pattern as above but condensed.
 */
export const extendedChineseListenerTestCases: Array<{
  id: string;
  label: string;
  sceneDescription: string;
  acceptableCultures: string[];
  preferredLanguages: string[];
  minimumChineseListenerFit: number;
  forbiddenMusicScenes: string[];
}> = [
  {
    id: "rooftop-night",
    label: "天台夜景",
    sceneDescription: "公寓楼顶天台，晾衣绳、远处城市灯光、微风，一个人站着",
    acceptableCultures: ["Chinese Indie", "City Pop", "Mandopop"],
    preferredLanguages: ["Mandarin"],
    minimumChineseListenerFit: 0.55,
    forbiddenMusicScenes: ["Campus Sunset", "Park Grass / Bench", "Garden"],
  },
  {
    id: "morning-commute",
    label: "早高峰地铁",
    sceneDescription: "拥挤的地铁车厢，清晨通勤人群，窗外隧道灯光",
    acceptableCultures: ["Mandopop", "Chinese Indie"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    minimumChineseListenerFit: 0.6,
    forbiddenMusicScenes: ["Campus Sunset", "Garden"],
  },
  {
    id: "library-study",
    label: "图书馆自习",
    sceneDescription: "大学图书馆自习区，台灯、书本、安静、窗外是校园",
    acceptableCultures: ["Chinese Indie", "Mandopop Light", "Folk"],
    preferredLanguages: ["Mandarin"],
    minimumChineseListenerFit: 0.6,
    forbiddenMusicScenes: ["Late Night Convenience Store", "Subway / Empty Metro"],
  },
  {
    id: "night-market",
    label: "夜市",
    sceneDescription: "热闹的夜市，各色小吃摊、霓虹招牌、人群穿行",
    acceptableCultures: ["Mandopop", "Cantopop", "Chinese Indie"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    minimumChineseListenerFit: 0.65,
    forbiddenMusicScenes: ["Rainy Window", "Airport Waiting"],
  },
  {
    id: "bicycle-lane",
    label: "自行车道",
    sceneDescription: "城市专用自行车道，两旁绿树，阳光透过树叶，一个人骑行",
    acceptableCultures: ["Chinese Indie", "Folk", "Mandopop Light"],
    preferredLanguages: ["Mandarin"],
    minimumChineseListenerFit: 0.6,
    forbiddenMusicScenes: ["Late Night Convenience Store", "Hotel Room"],
  },
  {
    id: "laundry-balcony",
    label: "阳台晾衣",
    sceneDescription: "小区阳台，晾晒的床单和衣物，午后的风和阳光",
    acceptableCultures: ["Chinese Indie", "Mandopop", "Taiwan Indie"],
    preferredLanguages: ["Mandarin"],
    minimumChineseListenerFit: 0.6,
    forbiddenMusicScenes: ["Late Night Convenience Store", "Airport Waiting"],
  },
  {
    id: "rainy-bus-stop",
    label: "雨中等公交",
    sceneDescription: "公交站台，一个人撑着伞在雨中等车，路灯昏黄",
    acceptableCultures: ["Mandopop", "Chinese Indie", "Cantopop"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    minimumChineseListenerFit: 0.6,
    forbiddenMusicScenes: ["Campus Sunset", "Park Grass / Bench"],
  },
  {
    id: "office-overtime",
    label: "办公室加班",
    sceneDescription: "深夜办公室，电脑屏幕亮着，窗外城市灯光，只有一个人",
    acceptableCultures: ["Chinese Indie", "City Pop", "Mandopop"],
    preferredLanguages: ["Mandarin"],
    minimumChineseListenerFit: 0.55,
    forbiddenMusicScenes: ["Campus Sunset", "Park Grass / Bench", "Garden"],
  },
  {
    id: "flower-market",
    label: "花市",
    sceneDescription: "周末花市，各色鲜花摆满摊位，阳光明媚，人们挑选花束",
    acceptableCultures: ["Mandopop", "Chinese Indie", "Taiwan Indie"],
    preferredLanguages: ["Mandarin"],
    minimumChineseListenerFit: 0.6,
    forbiddenMusicScenes: ["Late Night Convenience Store", "Subway / Empty Metro"],
  },
  {
    id: "bridge-sunset",
    label: "桥上看日落",
    sceneDescription: "跨江大桥人行道上，看日落和江水，远处是城市天际线",
    acceptableCultures: ["Chinese Indie", "Mandopop", "City Pop"],
    preferredLanguages: ["Mandarin"],
    minimumChineseListenerFit: 0.6,
    forbiddenMusicScenes: ["Late Night Convenience Store", "Bus Stop"],
  },
  {
    id: "dorm-room",
    label: "大学宿舍",
    sceneDescription: "大学宿舍房间，上下铺、书桌台灯、墙上贴着海报，窗帘半拉",
    acceptableCultures: ["Mandopop Youth", "Chinese Indie", "Campus Folk"],
    preferredLanguages: ["Mandarin"],
    minimumChineseListenerFit: 0.65,
    forbiddenMusicScenes: ["Late Night Convenience Store", "Hotel Room", "Airport Waiting"],
  },
  {
    id: "winter-street",
    label: "冬日街道",
    sceneDescription: "冬天城市街道，枯树、行人裹着厚外套、呼出白气",
    acceptableCultures: ["Chinese Indie", "Mandopop", "Taiwan Indie"],
    preferredLanguages: ["Mandarin"],
    minimumChineseListenerFit: 0.6,
    forbiddenMusicScenes: ["Campus Sunset", "Park Grass / Bench"],
  },
  {
    id: "rooftop-party",
    label: "天台聚会",
    sceneDescription: "朋友在天台BBQ，串灯亮着，啤酒、音乐、城市夜景",
    acceptableCultures: ["Mandopop", "Chinese Indie", "City Pop", "Cantopop"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    minimumChineseListenerFit: 0.6,
    forbiddenMusicScenes: ["Rainy Window", "Airport Waiting"],
  },
  {
    id: "morning-market",
    label: "清晨菜市场",
    sceneDescription: "早上菜市场，摆摊的商贩、新鲜蔬菜水果、晨光",
    acceptableCultures: ["Chinese Indie", "Mandopop", "Cantopop Classic"],
    preferredLanguages: ["Mandarin", "Cantonese"],
    minimumChineseListenerFit: 0.55,
    forbiddenMusicScenes: ["Late Night Convenience Store", "Hotel Room"],
  },
  {
    id: "temple-courtyard",
    label: "寺庙庭院",
    sceneDescription: "安静寺庙庭院，古树、香炉、石板路，有真正的中式建筑证据",
    acceptableCultures: ["Chinese Classical Cross", "Mandopop Slow", "Folk"],
    preferredLanguages: ["Mandarin", "Instrumental"],
    minimumChineseListenerFit: 0.65,
    forbiddenMusicScenes: ["Late Night Convenience Store", "Subway / Empty Metro"],
  },
];
