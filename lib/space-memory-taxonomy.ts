export type SpaceMemoryType =
  | "campus_youth"
  | "city_park_restorative"
  | "night_city_dining"
  | "rain_window_solitude"
  | "chinese_garden_water"
  | "flower_dream_portrait"
  | "travel_landscape"
  | "daily_life_home"
  | "unknown_soft_memory";

export type SpaceMemoryCategory = {
  id: SpaceMemoryType;
  name: string;
  triggers: string[];
  emotions: string[];
  musicUniverse: string[];
};

export const spaceMemoryTaxonomy: SpaceMemoryCategory[] = [
  {
    id: "campus_youth",
    name: "校园 / 教室 / 青春",
    triggers: ["教室", "黑板", "课桌", "校服", "操场", "窗边", "毕业", "下课", "晚自习", "夏天", "校园", "走廊", "同学"],
    emotions: ["青春", "告别", "遗憾", "夏天", "未完成感"],
    musicUniverse: ["周杰伦", "五月天", "孙燕姿", "王栎鑫", "华语青春 OST"],
  },
  {
    id: "city_park_restorative",
    name: "公园 / 草地 / 恢复性空间",
    triggers: ["公园", "草地", "树荫", "长椅", "湖边", "城市绿地", "散步", "晚风", "骑行", "树影"],
    emotions: ["恢复", "松弛", "呼吸感", "轻盈", "治愈"],
    musicUniverse: ["陈粒", "房东的猫", "橘子海", "旅行团", "华语轻民谣", "华语 city pop"],
  },
  {
    id: "night_city_dining",
    name: "深夜城市 / 餐厅 / 微醺",
    triggers: ["餐厅", "夜晚", "灯光", "酒杯", "街角", "便利店", "出租车", "霓虹", "耳机", "舞台", "演唱会", "聚餐"],
    emotions: ["微醺", "孤独", "城市感", "暧昧", "深夜"],
    musicUniverse: ["郭顶", "陶喆", "陈奕迅", "落日飞车", "deca joins", "城市夜晚感"],
  },
  {
    id: "rain_window_solitude",
    name: "雨后 / 窗边 / 独处",
    triggers: ["雨", "窗边", "玻璃", "路灯", "湿润", "房间", "夜灯", "一个人", "低落", "安静", "雨后", "水痕"],
    emotions: ["独处", "低落", "安静", "思念", "雨夜"],
    musicUniverse: ["郭顶", "陈奕迅", "莫文蔚", "周杰伦慢歌", "雨夜钢琴"],
  },
  {
    id: "chinese_garden_water",
    name: "东方庭院 / 园林 / 水面",
    triggers: ["亭台", "水面", "倒影", "白墙", "瓦片", "园林", "湖", "桥", "竹影", "屋檐", "中式建筑", "古典园林"],
    emotions: ["留白", "水气", "古典", "安静", "东方电影感"],
    musicUniverse: ["林海", "陈致逸", "古琴", "笛", "东方电影配乐"],
  },
  {
    id: "flower_dream_portrait",
    name: "花园 / 少女 / 柔光 / 梦幻",
    triggers: ["花", "花园", "玫瑰", "粉色", "柔光", "裙子", "人像", "写真", "梦幻", "春日", "少女感", "花瓣"],
    emotions: ["梦幻", "柔软", "春日", "浪漫", "明亮"],
    musicUniverse: ["房东的猫", "陈绮贞", "苏打绿", "甜约翰", "梦幻流行", "soft pop"],
  },
  {
    id: "travel_landscape",
    name: "旅行 / 风景 / 远方",
    triggers: ["海边", "山", "天空", "车窗", "机场", "高铁", "路上", "远方", "旅行", "风景"],
    emotions: ["远方", "自由", "开阔", "漂浮", "告别"],
    musicUniverse: ["陈绮贞", "夏日入侵企画", "橘子海", "旅行团", "华语 indie"],
  },
  {
    id: "daily_life_home",
    name: "日常生活 / 房间 / 居住感",
    triggers: ["房间", "床", "桌子", "窗帘", "灯", "厨房", "生活物件", "居住", "午后", "卧室", "客厅", "沙发", "台灯", "阳台", "日常"],
    emotions: ["私密", "温暖", "安静", "生活感", "独处"],
    musicUniverse: ["陈绮贞", "莫文蔚", "轻民谣", "卧室流行", "lofi"],
  },
  {
    id: "unknown_soft_memory",
    name: "模糊但柔和的记忆",
    triggers: ["柔和", "温暖", "安静", "胶片", "旧照片", "记忆", "光"],
    emotions: ["柔和", "怀旧", "安静", "温暖", "电影感"],
    musicUniverse: ["华语轻民谣", "温柔流行", "安静钢琴"],
  },
];

export const CULTURAL_SIGNAL_TRIGGERS = [
  "亭台",
  "水面",
  "倒影",
  "白墙",
  "瓦片",
  "园林",
  "湖",
  "桥",
  "竹影",
  "屋檐",
  "中式建筑",
  "古典园林",
  "书法",
  "灯笼",
];
