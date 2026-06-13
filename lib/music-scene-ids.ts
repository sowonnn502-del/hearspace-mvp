/**
 * Unified Music Scene IDs
 *
 * ALL modules MUST use these constants for scene identification.
 * String comparison is FORBIDDEN — always use these constants.
 *
 * Display labels are separate and only used in UI rendering.
 */

export const MUSIC_SCENE_IDS = {
  CAFE_AFTERNOON: "Cafe Afternoon",
  CONCERT_AFTERGLOW: "Concert Afterglow",
  FRIENDS_GATHERING: "Friends Gathering",
  OLD_NEIGHBORHOOD: "Old Neighborhood",
  GARDEN_PORTRAIT: "Garden Portrait",
  RAINY_WINDOW: "Rainy Window",
  CAMPUS_SUNSET: "Campus Sunset",
  LATE_NIGHT_CONVENIENCE: "Late Night Convenience Store",
  AIRPORT_WAITING: "Airport Waiting",
  TRAIN_WINDOW: "Train Window",
  SUBWAY_EMPTY_METRO: "Subway / Empty Metro",
  HOTEL_ROOM: "Hotel Room",
  SEASIDE_SUNSET: "Seaside Sunset",
  PARK_GRASS_BENCH: "Park Grass / Bench",
  BUS_STOP: "Bus Stop",
  EMPTY_STATION: "Empty Station",
  OFFICE_NIGHT: "Office Night",
  BRIDGE_OVERPASS: "Bridge / Overpass",
  NIGHT_STREET_WALK: "Night Street Walk",
  CHINESE_GARDEN_WATER: "Chinese Garden / Water",
} as const;

export type MusicSceneId = (typeof MUSIC_SCENE_IDS)[keyof typeof MUSIC_SCENE_IDS];

/** Display labels — UI only, NEVER used in business logic */
export const MUSIC_SCENE_LABELS: Record<MusicSceneId, string> = {
  [MUSIC_SCENE_IDS.CAFE_AFTERNOON]: "Cafe Afternoon",
  [MUSIC_SCENE_IDS.CONCERT_AFTERGLOW]: "Concert Afterglow",
  [MUSIC_SCENE_IDS.FRIENDS_GATHERING]: "Friends Gathering",
  [MUSIC_SCENE_IDS.OLD_NEIGHBORHOOD]: "Old Neighborhood",
  [MUSIC_SCENE_IDS.GARDEN_PORTRAIT]: "Garden Portrait",
  [MUSIC_SCENE_IDS.RAINY_WINDOW]: "Rainy Window",
  [MUSIC_SCENE_IDS.CAMPUS_SUNSET]: "Campus Sunset",
  [MUSIC_SCENE_IDS.LATE_NIGHT_CONVENIENCE]: "Late Night Convenience Store",
  [MUSIC_SCENE_IDS.AIRPORT_WAITING]: "Airport Waiting",
  [MUSIC_SCENE_IDS.TRAIN_WINDOW]: "Train Window",
  [MUSIC_SCENE_IDS.SUBWAY_EMPTY_METRO]: "Subway / Empty Metro",
  [MUSIC_SCENE_IDS.HOTEL_ROOM]: "Hotel Room",
  [MUSIC_SCENE_IDS.SEASIDE_SUNSET]: "Seaside Sunset",
  [MUSIC_SCENE_IDS.PARK_GRASS_BENCH]: "Park Grass / Bench",
  [MUSIC_SCENE_IDS.BUS_STOP]: "Bus Stop",
  [MUSIC_SCENE_IDS.EMPTY_STATION]: "Empty Station",
  [MUSIC_SCENE_IDS.OFFICE_NIGHT]: "Office Night",
  [MUSIC_SCENE_IDS.BRIDGE_OVERPASS]: "Bridge / Overpass",
  [MUSIC_SCENE_IDS.NIGHT_STREET_WALK]: "Night Street Walk",
  [MUSIC_SCENE_IDS.CHINESE_GARDEN_WATER]: "Chinese Garden / Water",
};

/** Legacy human-readable names → scene IDs (for migration) */
export const LEGACY_TO_SCENE_ID: Record<string, MusicSceneId> = {
  "Cafe Afternoon": MUSIC_SCENE_IDS.CAFE_AFTERNOON,
  "Concert Afterglow": MUSIC_SCENE_IDS.CONCERT_AFTERGLOW,
  "Friends Gathering": MUSIC_SCENE_IDS.FRIENDS_GATHERING,
  "Old Neighborhood": MUSIC_SCENE_IDS.OLD_NEIGHBORHOOD,
  "Garden Portrait": MUSIC_SCENE_IDS.GARDEN_PORTRAIT,
  "Soft Garden Portrait": MUSIC_SCENE_IDS.GARDEN_PORTRAIT,
  "Rainy Window": MUSIC_SCENE_IDS.RAINY_WINDOW,
  "Campus Sunset": MUSIC_SCENE_IDS.CAMPUS_SUNSET,
  "Late Night Convenience Store": MUSIC_SCENE_IDS.LATE_NIGHT_CONVENIENCE,
  "Airport Waiting": MUSIC_SCENE_IDS.AIRPORT_WAITING,
  "Train Window": MUSIC_SCENE_IDS.TRAIN_WINDOW,
  "Subway / Empty Metro": MUSIC_SCENE_IDS.SUBWAY_EMPTY_METRO,
  "Hotel Room": MUSIC_SCENE_IDS.HOTEL_ROOM,
  "Seaside Sunset": MUSIC_SCENE_IDS.SEASIDE_SUNSET,
  "Park Grass / Bench": MUSIC_SCENE_IDS.PARK_GRASS_BENCH,
  "Bus Stop": MUSIC_SCENE_IDS.BUS_STOP,
  "Empty Station": MUSIC_SCENE_IDS.EMPTY_STATION,
  "Office Night": MUSIC_SCENE_IDS.OFFICE_NIGHT,
  "Bridge / Overpass": MUSIC_SCENE_IDS.BRIDGE_OVERPASS,
  "Night Street Walk": MUSIC_SCENE_IDS.NIGHT_STREET_WALK,
  "Chinese Garden / Water": MUSIC_SCENE_IDS.CHINESE_GARDEN_WATER,
};

/** Valid scene IDs set for runtime validation */
export const VALID_SCENE_IDS: ReadonlySet<string> = new Set(Object.values(MUSIC_SCENE_IDS));

/**
 * Validate and normalize a scene ID. Throws on unknown IDs.
 */
export function normalizeSceneId(input: string): MusicSceneId {
  // Try direct match first
  if (VALID_SCENE_IDS.has(input)) return input as MusicSceneId;

  // Try legacy name mapping
  const legacy = LEGACY_TO_SCENE_ID[input];
  if (legacy) return legacy;

  throw new Error(`Unknown scene ID or label: "${input}". Use a MUSIC_SCENE_IDS constant.`);
}

/**
 * Safe normalize — returns null instead of throwing
 */
export function tryNormalizeSceneId(input: string): MusicSceneId | null {
  try { return normalizeSceneId(input); } catch { return null; }
}

/**
 * Normalize an array of scene strings to scene IDs.
 * Invalid entries are silently dropped.
 */
export function normalizeSceneIds(inputs: string[]): MusicSceneId[] {
  return inputs
    .map((s) => tryNormalizeSceneId(s))
    .filter((s): s is MusicSceneId => s !== null);
}
