import type { SpaceMemoryType } from "@/lib/space-memory-taxonomy";

export const musicScenes = [
  "教室",
  "校园",
  "操场",
  "公园",
  "草地",
  "花园",
  "房间",
  "窗边",
  "夜路",
  "餐厅",
  "街角",
  "水面",
  "庭院",
  "旅途",
] as const;

export const musicAtmospheres = [
  "青春",
  "城市",
  "独处",
  "空间感",
  "松弛",
  "微醺",
  "梦幻",
  "恢复性",
  "告别",
  "怀念",
  "温柔",
  "清冷",
] as const;

export const musicMemoryTypes = [
  "campus_youth",
  "city_park_restorative",
  "night_city_dining",
  "rain_window_solitude",
  "chinese_garden_water",
  "flower_dream_portrait",
  "daily_life_home",
  "travel_landscape",
  "unknown_soft_memory",
] as const satisfies readonly SpaceMemoryType[];

export const musicPaces = ["slow", "medium", "upbeat"] as const;
export const musicSeasons = ["spring", "summer", "autumn", "winter", "all"] as const;
export const musicLightTones = ["soft", "warm", "cool", "dark", "bright", "neutral"] as const;

export type MusicScene = (typeof musicScenes)[number];
export type MusicAtmosphere = (typeof musicAtmospheres)[number];
export type MusicMemoryType = (typeof musicMemoryTypes)[number];
export type MusicPace = (typeof musicPaces)[number];
export type MusicSeason = (typeof musicSeasons)[number];
export type MusicLightTone = (typeof musicLightTones)[number];

export type MusicArchetype =
  | "campus_memory"
  | "city_night"
  | "solitary_window"
  | "soft_garden"
  | "restorative_park"
  | "daily_room"
  | "water_garden"
  | "traveling_light"
  | "unknown_soft_memory";
