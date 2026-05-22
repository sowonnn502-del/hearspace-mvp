export type MockFeedMood = {
  image: string;
  mood_title: string;
  time_label: string;
  writing: string;
  music_memory: string;
  visual_mood_tags: string[];
};

export const mockFeedMoods: MockFeedMood[] = [
  {
    image:
      "linear-gradient(135deg, rgba(246,241,232,0.18), rgba(184,92,56,0.34) 36%, rgba(49,90,102,0.72)), radial-gradient(circle at 36% 26%, rgba(246,241,232,0.72), transparent 20%), radial-gradient(circle at 68% 66%, rgba(102,115,91,0.4), transparent 28%)",
    mood_title: "春日天井",
    time_label: "Spring courtyard, 4:16 PM",
    writing:
      "天井里有一块缓慢变亮的天空，花影落在墙上，像一封没有寄出的信。",
    music_memory: "一段旧磁带里的木吉他，混着风声和很远的脚步。",
    visual_mood_tags: ["天井", "花影", "旧墙", "午后"],
  },
  {
    image:
      "linear-gradient(145deg, rgba(17,17,19,0.9), rgba(49,90,102,0.64) 46%, rgba(184,92,56,0.36)), radial-gradient(circle at 58% 42%, rgba(246,241,232,0.42), transparent 18%), radial-gradient(circle at 28% 70%, rgba(184,92,56,0.28), transparent 24%)",
    mood_title: "夜晚餐桌",
    time_label: "Night table, 10:38 PM",
    writing:
      "餐桌上的灯没有照亮整间屋子，只照亮几个碗、一点沉默，和还没说出口的话。",
    music_memory: "低声的爵士鼓刷，像杯壁上快要消失的水汽。",
    visual_mood_tags: ["暖灯", "餐桌", "低语", "深夜"],
  },
  {
    image:
      "linear-gradient(135deg, rgba(216,209,197,0.6), rgba(49,90,102,0.62) 48%, rgba(17,17,19,0.74)), radial-gradient(circle at 22% 32%, rgba(246,241,232,0.55), transparent 22%), radial-gradient(circle at 74% 54%, rgba(184,92,56,0.18), transparent 26%)",
    mood_title: "最后一课",
    time_label: "Last class, 5:12 PM",
    writing:
      "教室没有真正散场。粉笔灰、斜阳和空椅子，还在替那些道别留着位置。",
    music_memory: "慢钢琴和远处铃声，被下午的蓝色阴影轻轻盖住。",
    visual_mood_tags: ["空教室", "斜阳", "粉笔灰", "蓝影"],
  },
  {
    image:
      "linear-gradient(150deg, rgba(17,17,19,0.84), rgba(49,90,102,0.76) 42%, rgba(216,209,197,0.3)), radial-gradient(circle at 70% 30%, rgba(246,241,232,0.32), transparent 18%), radial-gradient(circle at 34% 78%, rgba(102,115,91,0.36), transparent 24%)",
    mood_title: "雨后街角",
    time_label: "After rain, 12:07 AM",
    writing:
      "雨停以后，街角还在发亮。霓虹被水面拉长，像城市刚刚醒来的记忆。",
    music_memory: "合成器的长尾音，贴着湿漉漉的柏油路缓慢滑过去。",
    visual_mood_tags: ["雨后", "街角", "霓虹", "夜色"],
  },
];
