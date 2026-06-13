/**
 * Golden Test Cases v2 — Structured required signals, actual taxonomy terms.
 * 30 cases total, designed to actually FAIL when recommendations are wrong.
 */

export type GoldenTestCase = {
  id: string;
  label: string;
  imageEvidence: {
    visibleObjects: string[];
    spaceType: string[];
    timeContext: string[];
    socialContext: string[];
    visualStyle: string[];
  };
  requiredSignals: {
    scene: string[];    // memory types / primary music scenes
    objects: string[];  // visible objects in matched evidence
    time: string[];     // time context
    social: string[];   // social context
    visual: string[];   // visual style
  };
  preferredSignals: string[];
  forbiddenSignals: string[];  // memory types / music scene tags that must NOT appear
  expectedAudienceProfile: string[];
  expectedFamiliarityMix: { high: number; medium: number; discovery: number };
  forbiddenTracks?: string[];
  forbiddenArtists?: string[];
  minVerifiedListenerEvidence: number;
  minWithPrimaryScene: number;
  humanNotes: string;
};

export const goldenTestCases: GoldenTestCase[] = [
  // ═══ 1. Garden Portrait ═══
  {
    id: "golden-garden-portrait",
    label: "玫瑰花园柔光人像",
    imageEvidence: {
      visibleObjects: ["玫瑰", "花园", "黄色纱裙", "柔光", "人物肖像"],
      spaceType: ["Garden", "Natural Space", "Portrait Setting"],
      timeContext: ["Afternoon", "Soft Light"],
      socialContext: ["Being Photographed", "Fashion Portrait"],
      visualStyle: ["Pink Bloom", "Soft Focus", "Warm Light"],
    },
    requiredSignals: {
      scene: ["flower_dream_portrait", "Garden Portrait"],
      objects: ["花园", "Garden", "玫瑰"],
      time: ["spring", "Afternoon", "all"],
      social: ["Romantic", "Dreamy", "Soft Bloom"],
      visual: ["Soft Focus", "Warm Light", "Pink Bloom"],
    },
    preferredSignals: ["Garden Portrait", "flower_dream_portrait"],
    forbiddenSignals: ["night_city_dining", "rain_window_solitude", "travel_landscape", "Late Night Convenience Store", "Subway / Empty Metro", "Airport Waiting"],
    expectedAudienceProfile: ["90后", "00后"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "玫瑰花园+柔光+肖像。必须匹配花园/人像空间。禁止旅行、雨夜、深夜场景。",
  },

  // ═══ 2. Late Night Convenience ═══
  {
    id: "golden-convenience-store",
    label: "深夜便利店",
    imageEvidence: {
      visibleObjects: ["货架", "白灯光", "冷柜", "玻璃门"],
      spaceType: ["Commercial Space", "Urban Space"],
      timeContext: ["Late Night"],
      socialContext: ["Alone", "Passing Through"],
      visualStyle: ["Fluorescent Light", "Low Light", "Cool Tone"],
    },
    requiredSignals: {
      scene: ["night_city_dining", "Late Night Convenience Store"],
      objects: ["便利店", "Convenience Store", "深夜"],
      time: ["Late Night", "暗", "dark"],
      social: ["Alone", "Passing Through"],
      visual: ["Low Light", "Fluorescent Light"],
    },
    preferredSignals: ["night_city_dining"],
    forbiddenSignals: ["campus_youth", "flower_dream_portrait", "city_park_restorative", "Campus Sunset", "Park Grass / Bench", "Garden Portrait"],
    expectedAudienceProfile: ["90后", "00后", "城市青年"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "深夜便利店=城市孤独夜空间。禁止校园、公园、花园歌曲。",
  },

  // ═══ 3. Campus Sunset ═══
  {
    id: "golden-campus-sunset",
    label: "校园黄昏",
    imageEvidence: {
      visibleObjects: ["操场", "跑道", "梧桐树", "夕阳"],
      spaceType: ["Campus Space", "Outdoor"],
      timeContext: ["Golden Hour", "After School"],
      socialContext: ["Alone", "After School"],
      visualStyle: ["Sunset", "Golden Hour", "Warm Light"],
    },
    requiredSignals: {
      scene: ["campus_youth", "Campus Sunset"],
      objects: ["操场", "校园", "Campus"],
      time: ["summer", "Golden Hour", "Afternoon"],
      social: ["Youth", "After School", "Graduation"],
      visual: ["Warm Light", "Golden Hour"],
    },
    preferredSignals: ["campus_youth", "Youth"],
    forbiddenSignals: ["night_city_dining", "travel_landscape", "rain_window_solitude", "Late Night Convenience Store", "Airport Waiting", "Hotel Room"],
    expectedAudienceProfile: ["90后", "00后", "学生"],
    expectedFamiliarityMix: { high: 2, medium: 1, discovery: 0 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 3,
    humanNotes: "校园黄昏=青春空间。应以高熟悉度为主。禁止深夜/旅行/酒店。",
  },

  // ═══ 4. Airport Waiting ═══
  {
    id: "golden-airport-waiting",
    label: "机场候机",
    imageEvidence: {
      visibleObjects: ["大玻璃窗", "停机坪", "座椅", "行李箱"],
      spaceType: ["Transit Space", "Travel Space"],
      timeContext: ["Late Night", "Early Morning"],
      socialContext: ["Waiting", "Passing Through"],
      visualStyle: ["Blue Hour", "Low Light", "Muted Color"],
    },
    requiredSignals: {
      scene: ["travel_landscape", "Airport Waiting"],
      objects: ["机场", "候机", "停机坪"],
      time: ["Late Night", "all"],
      social: ["Waiting", "Long Trip"],
      visual: ["Blue Hour", "Low Light"],
    },
    preferredSignals: ["travel_landscape"],
    forbiddenSignals: ["campus_youth", "flower_dream_portrait", "city_park_restorative", "Campus Sunset", "Park Grass / Bench", "Garden Portrait"],
    expectedAudienceProfile: ["85后", "90后", "00后"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "机场候机=旅行等待。禁止校园、公园、花园。",
  },

  // ═══ 5. Rainy Window ═══
  {
    id: "golden-rainy-window",
    label: "雨天窗边",
    imageEvidence: {
      visibleObjects: ["玻璃窗", "雨痕", "街道", "路灯"],
      spaceType: ["Residential Space", "Solitude Space"],
      timeContext: ["Rain", "Overcast"],
      socialContext: ["Alone", "Looking Outside"],
      visualStyle: ["Rainy", "Window Light", "Low Light"],
    },
    requiredSignals: {
      scene: ["rain_window_solitude", "Rainy Window"],
      objects: ["雨", "窗", "Rainy", "Window"],
      time: ["Rainy", "Rain Season", "all"],
      social: ["Alone", "Quiet", "Private Room"],
      visual: ["Rainy", "Window Light", "Low Light"],
    },
    preferredSignals: ["rain_window_solitude"],
    forbiddenSignals: ["campus_youth", "flower_dream_portrait", "city_park_restorative", "Campus Sunset", "Garden Portrait", "Seaside Sunset"],
    expectedAudienceProfile: ["85后", "90后", "00后"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "雨天窗边=室内独处空间。禁止户外、社交场景。",
  },

  // ═══ 6-15: More cases in structured format ═══
  {
    id: "golden-subway-last-train",
    label: "地铁末班车",
    imageEvidence: {
      visibleObjects: ["空座位", "扶手", "白灯光", "车窗", "站台"],
      spaceType: ["Transit Space", "Urban Space"],
      timeContext: ["Late Night"],
      socialContext: ["Alone", "Waiting"],
      visualStyle: ["Fluorescent Light", "Low Light", "Metallic"],
    },
    requiredSignals: {
      scene: ["night_city_dining", "Subway / Empty Metro", "travel_landscape"],
      objects: ["地铁", "Subway", "站台"],
      time: ["Late Night", "all"],
      social: ["Alone", "Waiting"],
      visual: ["Low Light", "Blue Hour"],
    },
    preferredSignals: [],
    forbiddenSignals: ["campus_youth", "flower_dream_portrait", "city_park_restorative"],
    expectedAudienceProfile: ["90后", "00后", "通勤者"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "地铁空站=地下通勤。与天桥夜景不同（露天vs地下）。",
  },
  {
    id: "golden-train-window",
    label: "高铁窗边",
    imageEvidence: {
      visibleObjects: ["车窗", "田野", "远山", "阳光", "座位"],
      spaceType: ["Transit Space", "Travel Space"],
      timeContext: ["Afternoon", "Sunny"],
      socialContext: ["Passing Through", "Looking Outside"],
      visualStyle: ["Window Light", "Warm Light", "Green"],
    },
    requiredSignals: {
      scene: ["travel_landscape", "Train Window"],
      objects: ["Train", "Window", "田野"],
      time: ["Afternoon", "all"],
      social: ["Passing Through", "Long Trip"],
      visual: ["Window Light", "Warm Light"],
    },
    preferredSignals: [],
    forbiddenSignals: ["night_city_dining", "rain_window_solitude", "Late Night Convenience Store", "Cafe Afternoon", "Garden Portrait"],
    expectedAudienceProfile: ["90后", "00后", "旅行者"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "高铁窗边=旅行移动。与机场类似但场景标签不同。",
  },
  {
    id: "golden-hotel-room",
    label: "酒店独处",
    imageEvidence: {
      visibleObjects: ["床", "床头灯", "窗外城市灯光", "行李箱"],
      spaceType: ["Travel Space", "Commercial Space", "Solitude Space"],
      timeContext: ["Late Night"],
      socialContext: ["Temporary Stay", "Alone"],
      visualStyle: ["Warm Light", "Low Light", "City Night"],
    },
    requiredSignals: {
      scene: ["rain_window_solitude", "Hotel Room", "daily_life_home"],
      objects: ["Hotel", "Room", "酒店"],
      time: ["Late Night", "all"],
      social: ["Temporary Stay", "Alone", "Private Room"],
      visual: ["Warm Light", "Low Light"],
    },
    preferredSignals: [],
    forbiddenSignals: ["campus_youth", "flower_dream_portrait", "city_park_restorative"],
    expectedAudienceProfile: ["90后", "00后"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "酒店=临时独处。与雨天窗边不同（临时vs固定居所）。",
  },
  {
    id: "golden-seaside-sunset",
    label: "海边日落",
    imageEvidence: {
      visibleObjects: ["海", "沙滩", "日落", "船", "波浪"],
      spaceType: ["Travel Space", "Natural Space"],
      timeContext: ["Golden Hour", "Sunset"],
      socialContext: ["Passing Through", "Sightseeing"],
      visualStyle: ["Sunset", "Water Reflection", "Golden Hour"],
    },
    requiredSignals: {
      scene: ["travel_landscape", "Seaside Sunset", "city_park_restorative"],
      objects: ["海", "Seaside", "日落"],
      time: ["Sunset", "Golden Hour"],
      social: ["Free", "Long Trip"],
      visual: ["Sunset", "Water Reflection", "Golden Hour"],
    },
    preferredSignals: [],
    forbiddenSignals: ["night_city_dining", "rain_window_solitude", "Late Night Convenience Store", "Office Night"],
    expectedAudienceProfile: ["90后", "00后", "旅行者"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "海边日落=户外自然。与校园黄昏都含夕阳，但空间类型不同。",
  },
  {
    id: "golden-old-neighborhood",
    label: "老城区街巷",
    imageEvidence: {
      visibleObjects: ["晾衣架", "老自行车", "红砖墙", "阳光", "窄巷"],
      spaceType: ["Urban Space", "Residential Space"],
      timeContext: ["Afternoon", "Sunny"],
      socialContext: ["Daily Ritual", "Walking Through"],
      visualStyle: ["Warm Light", "Golden Hour", "Muted Color"],
    },
    requiredSignals: {
      scene: ["daily_life_home", "Old Neighborhood", "city_park_restorative"],
      objects: ["老街", "Old Neighborhood", "小巷"],
      time: ["Afternoon", "all"],
      social: ["Daily Ritual", "Nostalgic"],
      visual: ["Warm Light", "Muted Color"],
    },
    preferredSignals: [],
    forbiddenSignals: ["travel_landscape", "night_city_dining", "Airport Waiting", "Seaside Sunset", "Office Night"],
    expectedAudienceProfile: ["85后", "90后", "00后"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "老城区=日常居住空间。禁止旅行、海边、便利店。",
  },
  {
    id: "golden-cafe-afternoon",
    label: "咖啡馆午后",
    imageEvidence: {
      visibleObjects: ["咖啡杯", "木桌", "玻璃窗", "街景"],
      spaceType: ["Commercial Space", "Residential Space"],
      timeContext: ["Afternoon", "Natural Light"],
      socialContext: ["Alone", "Reading", "Daily Ritual"],
      visualStyle: ["Warm Light", "Window Light", "Soft Focus"],
    },
    requiredSignals: {
      scene: ["city_park_restorative", "Cafe Afternoon", "daily_life_home"],
      objects: ["咖啡", "Cafe", "Window"],
      time: ["Afternoon", "warm", "all"],
      social: ["Daily Ritual", "Healing", "Restorative"],
      visual: ["Warm Light", "Window Light", "Soft Focus"],
    },
    preferredSignals: [],
    forbiddenSignals: ["rain_window_solitude", "night_city_dining", "travel_landscape", "Rainy Window", "Late Night Convenience Store", "Airport Waiting"],
    expectedAudienceProfile: ["90后", "00后", "文艺青年"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 2,
    minWithPrimaryScene: 1,
    humanNotes: "咖啡馆=白天室内社交空间。禁止雨夜、旅行、深夜。候选不足时允许2首。",
  },
  {
    id: "golden-friends-dinner",
    label: "朋友聚餐",
    imageEvidence: {
      visibleObjects: ["火锅", "餐具", "灯光", "围坐的人", "热气"],
      spaceType: ["Commercial Space", "Restaurant"],
      timeContext: ["Night", "Evening"],
      socialContext: ["Friends Gathering", "Eating Together"],
      visualStyle: ["Warm Light", "Soft Focus"],
    },
    requiredSignals: {
      scene: ["night_city_dining", "Friends Gathering"],
      objects: ["餐厅", "Restaurant", "火锅"],
      time: ["Night", "all"],
      social: ["Friends Gathering", "Warm"],
      visual: ["Warm Light"],
    },
    preferredSignals: [],
    forbiddenSignals: ["rain_window_solitude", "travel_landscape", "Rainy Window", "Hotel Room", "Empty Station", "Airport Waiting"],
    expectedAudienceProfile: ["90后", "00后", "社交型"],
    expectedFamiliarityMix: { high: 2, medium: 1, discovery: 0 },
    minVerifiedListenerEvidence: 2,
    minWithPrimaryScene: 1,
    humanNotes: "聚餐=社交温暖。禁止独处、等待、旅行。候选不足时允许2首。",
  },
  {
    id: "golden-office-overtime",
    label: "办公室加班",
    imageEvidence: {
      visibleObjects: ["电脑屏幕", "办公桌", "窗外城市灯光", "咖啡杯"],
      spaceType: ["Commercial Space", "Office"],
      timeContext: ["Late Night"],
      socialContext: ["Alone", "Working"],
      visualStyle: ["Blue Hour", "Low Light", "Screen Light"],
    },
    requiredSignals: {
      scene: ["night_city_dining", "Office Night", "daily_life_home"],
      objects: ["办公室", "Office", "电脑"],
      time: ["Late Night", "all"],
      social: ["Alone", "Working"],
      visual: ["Low Light", "Blue Hour"],
    },
    preferredSignals: [],
    forbiddenSignals: ["campus_youth", "flower_dream_portrait", "city_park_restorative", "Campus Sunset", "Garden Portrait", "Seaside Sunset"],
    expectedAudienceProfile: ["90后", "00后", "白领"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "办公室加班=室内工作夜。禁止户外、休闲场景。",
  },
  {
    id: "golden-bridge-night",
    label: "天桥夜景",
    imageEvidence: {
      visibleObjects: ["天桥", "车流", "远处灯光", "城市天际线"],
      spaceType: ["Urban Space", "Bridge"],
      timeContext: ["Night", "Blue Hour"],
      socialContext: ["Alone", "Passing Through"],
      visualStyle: ["Blue Hour", "Neon", "Low Light"],
    },
    requiredSignals: {
      scene: ["night_city_dining", "Bridge / Overpass"],
      objects: ["天桥", "Bridge", "Overpass"],
      time: ["Night", "all"],
      social: ["Alone", "Passing Through"],
      visual: ["Blue Hour", "Low Light", "Neon"],
    },
    preferredSignals: [],
    forbiddenSignals: ["campus_youth", "flower_dream_portrait", "city_park_restorative"],
    expectedAudienceProfile: ["90后", "00后", "城市青年"],
    expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3,
    minWithPrimaryScene: 2,
    humanNotes: "天桥夜景=城市露天交通。与地铁（地下）和便利店（室内）不同。",
  },
  {
    id: "golden-concert-afterglow",
    label: "演唱会散场",
    imageEvidence: {
      visibleObjects: ["人群散场", "路灯", "荧光棒", "场馆出口"],
      spaceType: ["Urban Space", "Commercial Space"],
      timeContext: ["Late Night"],
      socialContext: ["Farewell", "Crowd", "Excitement"],
      visualStyle: ["Low Light", "Warm Light"],
    },
    requiredSignals: {
      scene: ["night_city_dining", "Concert Afterglow", "campus_youth"],
      objects: ["演唱", "Concert", "散场"],
      time: ["Late Night", "all"],
      social: ["Farewell", "Youth", "Crowd"],
      visual: ["Low Light", "Warm Light"],
    },
    preferredSignals: [],
    forbiddenSignals: ["rain_window_solitude", "flower_dream_portrait", "Rainy Window", "Hotel Room", "Park Grass / Bench"],
    expectedAudienceProfile: ["90后", "00后", "音乐爱好者"],
    expectedFamiliarityMix: { high: 2, medium: 1, discovery: 0 },
    minVerifiedListenerEvidence: 2,
    minWithPrimaryScene: 1,
    humanNotes: "演唱会散场=集体情感。与个人独处完全相反。候选不足时允许2首。",
  },

  // ═══ 16-30: Remaining 15 cases ═══
  {
    id: "golden-park-grass",
    label: "公园草地",
    imageEvidence: {
      visibleObjects: ["草地", "树荫", "阳光", "长椅"], spaceType: ["Natural Space", "Urban Space"],
      timeContext: ["Afternoon"], socialContext: ["Daily Ritual"], visualStyle: ["Green Shadow", "Warm Light"],
    },
    requiredSignals: { scene: ["city_park_restorative", "Park Grass / Bench"], objects: ["公园", "草地", "Park"], time: ["Afternoon", "all"], social: ["Restorative", "Healing"], visual: ["Green Shadow", "Warm Light"] },
    preferredSignals: [], forbiddenSignals: ["night_city_dining", "rain_window_solitude"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "公园草地=户外恢复空间。",
  },
  {
    id: "golden-bus-stop",
    label: "公交站等车",
    imageEvidence: {
      visibleObjects: ["公交站牌", "路灯", "街道", "一个人撑伞"], spaceType: ["Transit Space", "Urban Space"],
      timeContext: ["Rain", "Night"], socialContext: ["Waiting", "Alone"], visualStyle: ["Rainy", "Low Light"],
    },
    requiredSignals: { scene: ["night_city_dining", "Bus Stop", "rain_window_solitude"], objects: ["公交", "Bus Stop", "车站"], time: ["Night", "Rainy", "all"], social: ["Waiting", "Alone"], visual: ["Rainy", "Low Light"] },
    preferredSignals: [], forbiddenSignals: ["campus_youth", "flower_dream_portrait", "city_park_restorative"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "公交站=城市通勤等待。与便利店不同（室外vs室内）。",
  },
  {
    id: "golden-empty-station",
    label: "空车站",
    imageEvidence: {
      visibleObjects: ["站台", "长椅", "时刻表", "轨道"], spaceType: ["Transit Space", "Urban Space"],
      timeContext: ["Late Night"], socialContext: ["Waiting", "Alone"], visualStyle: ["Low Light", "Blue Hour"],
    },
    requiredSignals: { scene: ["travel_landscape", "Empty Station"], objects: ["车站", "Station", "站台"], time: ["Late Night", "all"], social: ["Waiting", "Alone"], visual: ["Low Light", "Blue Hour"] },
    preferredSignals: [], forbiddenSignals: ["campus_youth", "flower_dream_portrait"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "空车站=旅行等待。与公交站不同（长途vs短途通勤）。",
  },
  {
    id: "golden-night-market",
    label: "夜市",
    imageEvidence: {
      visibleObjects: ["霓虹招牌", "小吃摊", "人群", "灯光"], spaceType: ["Commercial Space", "Urban Space"],
      timeContext: ["Night"], socialContext: ["Passing Through", "Crowd"], visualStyle: ["Neon", "Warm Light"],
    },
    requiredSignals: { scene: ["night_city_dining"], objects: ["夜市", "霓虹", "灯光"], time: ["Night"], social: ["Crowd", "Passing Through"], visual: ["Neon", "Warm Light"] },
    preferredSignals: [], forbiddenSignals: ["campus_youth", "flower_dream_portrait", "rain_window_solitude"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "夜市=热闹城市夜消费空间。",
  },
  {
    id: "golden-rooftop-night",
    label: "天台夜景",
    imageEvidence: {
      visibleObjects: ["天台", "晾衣绳", "远处灯光", "微风"], spaceType: ["Urban Space", "Residential Space"],
      timeContext: ["Night"], socialContext: ["Alone", "Relaxing"], visualStyle: ["Blue Hour", "Warm Light"],
    },
    requiredSignals: { scene: ["night_city_dining", "Bridge / Overpass"], objects: ["天台", "Rooftop", "夜景"], time: ["Night", "all"], social: ["Alone"], visual: ["Blue Hour", "Low Light"] },
    preferredSignals: [], forbiddenSignals: ["campus_youth", "flower_dream_portrait", "city_park_restorative"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "天台夜景=城市露天夜景。与天桥不同（私人vs公共）。",
  },
  {
    id: "golden-library-study",
    label: "图书馆自习",
    imageEvidence: {
      visibleObjects: ["书本", "台灯", "书桌", "窗外校园"], spaceType: ["Campus Space", "Commercial Space"],
      timeContext: ["Afternoon"], socialContext: ["Alone", "Studying"], visualStyle: ["Warm Light", "Quiet"],
    },
    requiredSignals: { scene: ["campus_youth", "daily_life_home"], objects: ["图书馆", "Library", "书本"], time: ["Afternoon", "all"], social: ["Alone", "Quiet"], visual: ["Warm Light"] },
    preferredSignals: [], forbiddenSignals: ["night_city_dining", "rain_window_solitude"],
    expectedAudienceProfile: ["95后", "00后", "学生"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "图书馆=安静学习空间。",
  },
  {
    id: "golden-dorm-room",
    label: "大学宿舍",
    imageEvidence: {
      visibleObjects: ["上下铺", "书桌台灯", "海报", "窗帘"], spaceType: ["Residential Space", "Campus Space"],
      timeContext: ["Night"], socialContext: ["Daily Ritual", "Private"], visualStyle: ["Warm Light", "Low Light"],
    },
    requiredSignals: { scene: ["campus_youth", "daily_life_home"], objects: ["宿舍", "Dorm", "房间"], time: ["Night", "all"], social: ["Daily Ritual", "Youth"], visual: ["Warm Light", "Low Light"] },
    preferredSignals: [], forbiddenSignals: ["night_city_dining", "travel_landscape"],
    expectedAudienceProfile: ["00后", "学生"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "大学宿舍=私密校园空间。",
  },
  {
    id: "golden-morning-commute",
    label: "早高峰地铁",
    imageEvidence: {
      visibleObjects: ["拥挤车厢", "扶手", "隧道灯光", "人群"], spaceType: ["Transit Space", "Urban Space"],
      timeContext: ["Morning"], socialContext: ["Crowd", "Commuting"], visualStyle: ["Fluorescent Light"],
    },
    requiredSignals: { scene: ["Subway / Empty Metro", "night_city_dining"], objects: ["地铁", "Subway", "车厢"], time: ["Morning", "all"], social: ["Crowd", "Commuting"], visual: ["Fluorescent Light"] },
    preferredSignals: [], forbiddenSignals: ["campus_youth", "flower_dream_portrait", "city_park_restorative"],
    expectedAudienceProfile: ["90后", "00后", "通勤者"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "早高峰地铁=拥挤通勤。与深夜空地铁的社会语境相反。",
  },
  {
    id: "golden-winter-street",
    label: "冬日街道",
    imageEvidence: {
      visibleObjects: ["枯树", "厚外套行人", "呼出白气", "街道"], spaceType: ["Urban Space"],
      timeContext: ["Winter", "Daytime"], socialContext: ["Passing Through"], visualStyle: ["Muted Color", "Cold Tone"],
    },
    requiredSignals: { scene: ["daily_life_home", "night_city_dining"], objects: ["街道", "Street", "冬日"], time: ["winter", "all"], social: ["Passing Through"], visual: ["Muted Color"] },
    preferredSignals: [], forbiddenSignals: ["campus_youth", "flower_dream_portrait", "Seaside Sunset"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "冬日街道=寒冷户外城市。季节信号是核心区分点。",
  },
  {
    id: "golden-bicycle-lane",
    label: "城市自行车道",
    imageEvidence: {
      visibleObjects: ["自行车", "绿树", "阳光", "专用道"], spaceType: ["Urban Space", "Outdoor"],
      timeContext: ["Afternoon", "Sunny"], socialContext: ["Alone", "Cycling"], visualStyle: ["Green Shadow", "Warm Light"],
    },
    requiredSignals: { scene: ["city_park_restorative", "Park Grass / Bench"], objects: ["自行车", "绿树", "阳光"], time: ["Afternoon", "all"], social: ["Alone", "Daily Ritual"], visual: ["Green Shadow", "Warm Light"] },
    preferredSignals: [], forbiddenSignals: ["night_city_dining", "rain_window_solitude"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "自行车道=户外城市运动空间。与公园共享恢复感。",
  },
  {
    id: "golden-laundry-balcony",
    label: "阳台晾衣",
    imageEvidence: {
      visibleObjects: ["晾晒床单", "阳台", "午后阳光", "小区景色"], spaceType: ["Residential Space"],
      timeContext: ["Afternoon"], socialContext: ["Daily Ritual"], visualStyle: ["Warm Light", "Soft Focus"],
    },
    requiredSignals: { scene: ["daily_life_home"], objects: ["阳台", "Balcony", "晾衣"], time: ["Afternoon", "all"], social: ["Daily Ritual"], visual: ["Warm Light", "Soft Focus"] },
    preferredSignals: [], forbiddenSignals: ["night_city_dining", "travel_landscape", "rain_window_solitude"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "阳台晾衣=日常居住空间。与酒店不同（固定vs临时）。",
  },
  {
    id: "golden-flower-market",
    label: "周末花市",
    imageEvidence: {
      visibleObjects: ["鲜花摊位", "人群挑选", "阳光", "各色花束"], spaceType: ["Commercial Space", "Natural Space"],
      timeContext: ["Morning", "Sunny"], socialContext: ["Crowd", "Shopping"], visualStyle: ["Warm Light", "Colorful"],
    },
    requiredSignals: { scene: ["city_park_restorative", "Garden Portrait"], objects: ["花", "Flower", "市场"], time: ["Morning", "all"], social: ["Crowd", "Daily Ritual"], visual: ["Warm Light"] },
    preferredSignals: [], forbiddenSignals: ["night_city_dining", "rain_window_solitude", "travel_landscape"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "花市=户外消费+自然空间。与花园肖像不同（热闹vs安静）。",
  },
  {
    id: "golden-bridge-sunset",
    label: "桥上看日落",
    imageEvidence: {
      visibleObjects: ["桥梁", "江水", "日落", "城市天际线"], spaceType: ["Urban Space", "Natural Space"],
      timeContext: ["Golden Hour", "Sunset"], socialContext: ["Alone", "Sightseeing"], visualStyle: ["Sunset", "Water Reflection", "Golden Hour"],
    },
    requiredSignals: { scene: ["travel_landscape", "Bridge / Overpass", "Seaside Sunset"], objects: ["桥", "Bridge", "日落"], time: ["Sunset", "Golden Hour"], social: ["Alone"], visual: ["Sunset", "Water Reflection"] },
    preferredSignals: [], forbiddenSignals: ["night_city_dining", "rain_window_solitude", "campus_youth"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "桥上看日落=城市自然交汇。与海边日落不同（城市vs纯粹自然）。",
  },
  {
    id: "golden-rooftop-party",
    label: "天台聚会",
    imageEvidence: {
      visibleObjects: ["串灯", "啤酒", "朋友", "城市夜景"], spaceType: ["Urban Space", "Residential Space"],
      timeContext: ["Night"], socialContext: ["Friends Gathering", "Party"], visualStyle: ["Warm Light", "City Night"],
    },
    requiredSignals: { scene: ["night_city_dining", "Friends Gathering"], objects: ["天台", "聚会", "Party"], time: ["Night"], social: ["Friends Gathering", "Warm"], visual: ["Warm Light", "City Night"] },
    preferredSignals: [], forbiddenSignals: ["rain_window_solitude", "travel_landscape", "campus_youth"],
    expectedAudienceProfile: ["90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 2, minWithPrimaryScene: 1,
    humanNotes: "天台聚会=社交夜场景。与天台独处不同。候选不足时允许2首。",
  },
  {
    id: "golden-morning-market",
    label: "清晨菜市场",
    imageEvidence: {
      visibleObjects: ["蔬菜摊位", "商贩", "晨光", "新鲜水果"], spaceType: ["Commercial Space", "Urban Space"],
      timeContext: ["Morning"], socialContext: ["Daily Ritual", "Crowd"], visualStyle: ["Warm Light"],
    },
    requiredSignals: { scene: ["daily_life_home", "Old Neighborhood"], objects: ["菜市场", "Market", "蔬菜"], time: ["Morning", "all"], social: ["Daily Ritual", "Crowd"], visual: ["Warm Light"] },
    preferredSignals: [], forbiddenSignals: ["night_city_dining", "rain_window_solitude", "travel_landscape"],
    expectedAudienceProfile: ["85后", "90后", "00后"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 3, minWithPrimaryScene: 2,
    humanNotes: "清晨菜市场=日常市井空间。与夜市不同（清晨vs夜晚）。",
  },
  {
    id: "golden-temple-courtyard",
    label: "寺庙庭院",
    imageEvidence: {
      visibleObjects: ["古树", "香炉", "石板路", "寺庙建筑", "红墙"], spaceType: ["Natural Space", "Cultural Space"],
      timeContext: ["Afternoon"], socialContext: ["Alone", "Contemplation"], visualStyle: ["Warm Light", "Green Shadow"],
    },
    requiredSignals: { scene: ["chinese_garden_water", "Chinese Garden / Water"], objects: ["寺庙", "庭院", "Temple", "Garden"], time: ["Afternoon", "all"], social: ["Alone", "Quiet"], visual: ["Warm Light", "Green Shadow"] },
    preferredSignals: [], forbiddenSignals: ["night_city_dining", "travel_landscape", "campus_youth"],
    expectedAudienceProfile: ["85后", "90后", "文艺听众"], expectedFamiliarityMix: { high: 1, medium: 1, discovery: 1 },
    minVerifiedListenerEvidence: 2, minWithPrimaryScene: 1,
    humanNotes: "寺庙庭院=东方文化空间。需要chinese_garden_water记忆类型。候选可能少。",
  },
];

// Confusion pairs unchanged from v1
export const confusionPairs = [
  { positive: "golden-garden-portrait", confusing: "golden-cafe-afternoon", reason: "柔光+安静→花园vs咖啡馆" },
  { positive: "golden-airport-waiting", confusing: "golden-train-window", reason: "Transit→机场vs高铁" },
  { positive: "golden-convenience-store", confusing: "golden-bridge-night", reason: "深夜城市→便利店vs天桥" },
  { positive: "golden-subway-last-train", confusing: "golden-bridge-night", reason: "城市交通→地铁vs天桥" },
  { positive: "golden-hotel-room", confusing: "golden-rainy-window", reason: "室内独处→酒店vs雨天窗边" },
  { positive: "golden-campus-sunset", confusing: "golden-seaside-sunset", reason: "夕阳→校园vs海边" },
];
