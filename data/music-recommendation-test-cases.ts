export type MusicRecommendationTestCase = {
  id: string;
  label: string;
  inputTags: {
    spaceTags: string[];
    sceneTags: string[];
    cityTags?: string[];
    timeTags?: string[];
    socialContextTags?: string[];
    memoryTags?: string[];
    visualTags?: string[];
    cultureTags?: string[];
    musicSceneTags?: string[];
    atmosphereTags?: string[];
    emotionTags?: string[];
  };
};

export const musicRecommendationTestCases: MusicRecommendationTestCase[] = [
  {
    id: "late-night-convenience-store",
    label: "深夜便利店",
    inputTags: {
      spaceTags: ["Urban Space", "Commercial Space"],
      sceneTags: ["Convenience Store"],
      cityTags: ["Late Night City", "Commercial Corner"],
      timeTags: ["Late Night"],
      socialContextTags: ["Alone", "Passing Through"],
      visualTags: ["Fluorescent Light", "Low Light", "Neon"],
      cultureTags: ["Chinese Indie", "City Pop", "Hong Kong Night"],
      musicSceneTags: ["Late Night Convenience Store"],
    },
  },
  {
    id: "campus-sunset",
    label: "校园黄昏",
    inputTags: {
      spaceTags: ["Campus Space"],
      sceneTags: ["Playground", "After School"],
      timeTags: ["After School", "Golden Hour"],
      socialContextTags: ["Alone", "Farewell"],
      memoryTags: ["Graduation", "After School"],
      visualTags: ["Sunset", "Golden Hour", "Warm Light"],
      cultureTags: ["Mandopop Youth"],
      musicSceneTags: ["Campus Sunset"],
    },
  },
  {
    id: "rainy-window",
    label: "雨天窗边",
    inputTags: {
      spaceTags: ["Residential Space", "Solitude Space"],
      sceneTags: ["Window", "Room"],
      timeTags: ["After Rain"],
      socialContextTags: ["Alone"],
      memoryTags: ["Rainy Window", "Private Room"],
      visualTags: ["Rainy", "Window Light", "Low Light"],
      cultureTags: ["Mandopop", "Chinese Indie"],
      musicSceneTags: ["Rainy Window"],
    },
  },
  {
    id: "city-night-view",
    label: "城市夜景",
    inputTags: {
      spaceTags: ["Urban Space"],
      sceneTags: ["Night Street", "Rooftop"],
      cityTags: ["Late Night City", "Neon Street"],
      timeTags: ["Late Night", "Blue Hour"],
      socialContextTags: ["Alone"],
      visualTags: ["Neon", "Blue Hour", "Low Light"],
      cultureTags: ["City Pop", "Hong Kong Night"],
      musicSceneTags: ["Night Street Walk", "Bridge / Overpass"],
    },
  },
  {
    id: "park-grass",
    label: "公园草地",
    inputTags: {
      spaceTags: ["Natural Space", "Urban Space"],
      sceneTags: ["Park"],
      timeTags: ["Afternoon"],
      socialContextTags: ["Daily Ritual", "Alone"],
      visualTags: ["Green Shadow", "Warm Light"],
      cultureTags: ["Chinese Indie", "Folk"],
      musicSceneTags: ["Park Grass / Bench"],
    },
  },
  {
    id: "seaside-sunset",
    label: "海边日落",
    inputTags: {
      spaceTags: ["Travel Space", "Natural Space"],
      sceneTags: ["Road Trip Sunset", "Lakeside"],
      timeTags: ["Golden Hour"],
      socialContextTags: ["Passing Through"],
      visualTags: ["Sunset", "Water Reflection", "Golden Hour"],
      cultureTags: ["Chinese Indie", "Mandopop"],
      musicSceneTags: ["Seaside Sunset"],
    },
  },
  {
    id: "hotel-room",
    label: "酒店房间",
    inputTags: {
      spaceTags: ["Travel Space", "Commercial Space", "Solitude Space"],
      sceneTags: ["Hotel", "Room"],
      cityTags: ["Temporary Stay"],
      timeTags: ["Late Night"],
      socialContextTags: ["Temporary Stay", "Alone"],
      memoryTags: ["Private Room", "Long Trip"],
      visualTags: ["Warm Light", "Low Light"],
      cultureTags: ["Mandopop", "Chinese Indie"],
      musicSceneTags: ["Hotel Room"],
    },
  },
  {
    id: "airport-waiting",
    label: "机场候机厅",
    inputTags: {
      spaceTags: ["Transit Space", "Travel Space"],
      sceneTags: ["Airport Waiting"],
      timeTags: ["Late Night"],
      socialContextTags: ["Waiting", "Passing Through"],
      memoryTags: ["Waiting", "Long Trip"],
      visualTags: ["Low Light", "Muted Color"],
      cultureTags: ["Mandopop", "Chinese Indie"],
      musicSceneTags: ["Airport Waiting"],
    },
  },
  {
    id: "walking-alone",
    label: "独自散步",
    inputTags: {
      spaceTags: ["Solitude Space", "Urban Space"],
      sceneTags: ["Night Street", "Park"],
      timeTags: ["Late Night", "Afternoon"],
      socialContextTags: ["Alone", "Daily Ritual"],
      memoryTags: ["Night Walk", "City Walk"],
      visualTags: ["Low Light", "Green Shadow"],
      cultureTags: ["Chinese Indie", "City Pop"],
      musicSceneTags: ["Night Street Walk", "Park Grass / Bench"],
    },
  },
  {
    id: "travel-train",
    label: "旅行列车",
    inputTags: {
      spaceTags: ["Transit Space", "Travel Space"],
      sceneTags: ["Train Window"],
      timeTags: ["Golden Hour"],
      socialContextTags: ["Passing Through"],
      memoryTags: ["Long Trip"],
      visualTags: ["Window Light", "Golden Hour"],
      cultureTags: ["Chinese Indie", "Mandopop"],
      musicSceneTags: ["Train Window"],
    },
  },
  {
    id: "empty-metro",
    label: "地铁空站",
    inputTags: {
      spaceTags: ["Transit Space", "Urban Space"],
      sceneTags: ["Subway"],
      cityTags: ["Commuter City", "Late Night City"],
      timeTags: ["Late Night"],
      socialContextTags: ["Alone", "Waiting"],
      memoryTags: ["Waiting", "Night Walk"],
      visualTags: ["Low Light", "Blue Hour"],
      cultureTags: ["City Pop", "Chinese Indie"],
      musicSceneTags: ["Subway / Empty Metro", "Empty Station"],
    },
  },
  {
    id: "bus-stop",
    label: "公交站",
    inputTags: {
      spaceTags: ["Transit Space", "Urban Space"],
      sceneTags: ["Night Street"],
      cityTags: ["Commuter City"],
      timeTags: ["Late Night", "After Rain"],
      socialContextTags: ["Waiting", "Alone"],
      memoryTags: ["Waiting", "Night Walk"],
      visualTags: ["Rainy", "Low Light"],
      cultureTags: ["Mandopop", "Chinese Indie"],
      musicSceneTags: ["Bus Stop"],
    },
  },
];
