export type MockFeedMood = {
  image: string;
  mood_title: string;
  time_label: string;
  writing: string;
  music_memory: string;
  visual_mood_tags: string[];
  source: string;
  audio_id: string;
  image_position?: string;
};

export const mockFeedMoods: MockFeedMood[] = [
  {
    image: "/feed/spring-courtyard.png",
    mood_title: "春日天井",
    time_label: "春日庭院  午后",
    writing:
      "天井里有一块缓慢变亮的天空，花影落在墙上，像一封没有寄出的信。",
    music_memory: "一段旧磁带里的木吉他，混着风声和很远的脚步。",
    visual_mood_tags: ["天井", "花影", "旧墙", "午后"],
    source: "来自 HearSpace",
    audio_id: "spring-courtyard",
    image_position: "center",
  },
  {
    image: "/feed/midnight-restaurant.png",
    mood_title: "夜晚餐桌",
    time_label: "夜晚餐桌  22:38",
    writing:
      "餐桌上的灯没有照亮整间屋子，只照亮几个碗、一点沉默，和还没说出口的话。",
    music_memory: "低声的爵士鼓刷，像杯壁上快要消失的水汽。",
    visual_mood_tags: ["暖灯", "餐桌", "低语", "深夜"],
    source: "来自 HearSpace",
    audio_id: "midnight-restaurant",
    image_position: "center",
  },
  {
    image: "/feed/last-classroom.png",
    mood_title: "最后一课",
    time_label: "校园旧照  傍晚",
    writing:
      "几张旧照片叠在一起，校服、窗光和还没说完的笑，都停在青春最明亮的那一页。",
    music_memory: "慢钢琴和远处铃声，像从走廊尽头传来的放学声。",
    visual_mood_tags: ["校园", "旧照", "校服", "青春"],
    source: "来自 HearSpace",
    audio_id: "last-classroom",
    image_position: "center",
  },
  {
    image: "/feed/city-park-breathing.png",
    mood_title: "城市公园呼吸",
    time_label: "城市公园  清晨",
    writing:
      "城市还没有完全醒来，树影先替人群呼吸，风把昨夜的疲惫慢慢松开。",
    music_memory: "很轻的环境电子，像晨光穿过树叶后落在长椅上。",
    visual_mood_tags: ["公园", "晨光", "恢复", "城市"],
    source: "来自 HearSpace",
    audio_id: "city-park-breathing",
    image_position: "center",
  },
];
