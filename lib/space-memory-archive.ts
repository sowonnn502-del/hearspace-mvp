import type { MusicMemoryRecommendation } from "@/lib/music-library";
import type { MoodResult } from "@/lib/mood-schema";
import { inferMoodTaxonomyTags } from "@/lib/taxonomy";

export const SPACE_MEMORY_ARCHIVE_KEY = "hearspace:space-memory-archive";

export type ArchivedSong = {
  trackId: string;
  title: string;
  artist: string;
  reason: string;
  coverUrl?: string;
  songUrl?: string;
};

export type SpaceMemoryArchiveItem = {
  id: string;
  createdAt: string;
  image: string | null;
  userNote?: string;
  spaceTags?: string[];
  sceneTags?: string[];
  emotionTags?: string[];
  memoryTags?: string[];
  visualTags?: string[];
  moodTitle: string;
  moodSubtitle: string;
  memoryText: string;
  visualTone: string[];
  songs: ArchivedSong[];
};

export function createArchiveItem(
  result: MoodResult,
  image: string | null,
  recommendations: MusicMemoryRecommendation[],
  userNote?: string,
): SpaceMemoryArchiveItem {
  const createdAt = new Date().toISOString();
  const taxonomyTags = inferMoodTaxonomyTags(result);

  return {
    id: createArchiveId(createdAt),
    createdAt,
    image,
    userNote: userNote?.trim() || undefined,
    spaceTags: result.spaceTags?.length ? result.spaceTags : taxonomyTags.spaceTags,
    sceneTags: result.sceneTags?.length ? result.sceneTags : taxonomyTags.sceneTags,
    emotionTags: result.emotionTags?.length ? result.emotionTags : taxonomyTags.emotionTags,
    memoryTags: result.memoryTags?.length ? result.memoryTags : taxonomyTags.memoryTags,
    visualTags: result.visualTags?.length ? result.visualTags : taxonomyTags.visualTags,
    moodTitle: result.mood_title,
    moodSubtitle: result.mood_subtitle,
    memoryText: result.space_memory_text || result.writing,
    visualTone: uniqueStrings([
      ...result.visual_tone,
      ...result.visual_mood_tags,
      result.time_label,
    ]).slice(0, 6),
    songs: recommendations.slice(0, 3).map((recommendation) => {
      const song = recommendation.song;

      return {
        trackId:
          song.songId ||
          song.neteaseSongId ||
          song.id ||
          `${song.title}:${song.artist}`.toLowerCase(),
        title: song.title,
        artist: song.artist,
        reason: recommendation.reason,
        coverUrl: song.coverUrl,
        songUrl: song.songUrl,
      };
    }),
  };
}

export function readArchiveItems(): SpaceMemoryArchiveItem[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(SPACE_MEMORY_ARCHIVE_KEY) || "[]",
    );

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isArchiveItem).sort(compareArchiveItems);
  } catch {
    return [];
  }
}

export function saveArchiveItem(item: SpaceMemoryArchiveItem) {
  const current = readArchiveItems();
  const next = [item, ...current.filter((archiveItem) => archiveItem.id !== item.id)]
    .sort(compareArchiveItems);

  window.localStorage.setItem(SPACE_MEMORY_ARCHIVE_KEY, JSON.stringify(next));

  return next;
}

export function deleteArchiveItem(id: string) {
  const next = readArchiveItems().filter((item) => item.id !== id);
  window.localStorage.setItem(SPACE_MEMORY_ARCHIVE_KEY, JSON.stringify(next));

  return next;
}

export function findArchiveItem(id: string) {
  return readArchiveItems().find((item) => item.id === id) ?? null;
}

function createArchiveId(createdAt: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `memory-${Date.parse(createdAt).toString(36)}-${random}`;
}

function compareArchiveItems(a: SpaceMemoryArchiveItem, b: SpaceMemoryArchiveItem) {
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}

function uniqueStrings(values: Array<string | undefined>) {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function isArchiveItem(value: unknown): value is SpaceMemoryArchiveItem {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.createdAt === "string" &&
    (typeof record.image === "string" || record.image === null) &&
    (typeof record.userNote === "string" || record.userNote === undefined) &&
    isOptionalStringArray(record.spaceTags) &&
    isOptionalStringArray(record.sceneTags) &&
    isOptionalStringArray(record.emotionTags) &&
    isOptionalStringArray(record.memoryTags) &&
    isOptionalStringArray(record.visualTags) &&
    typeof record.moodTitle === "string" &&
    typeof record.moodSubtitle === "string" &&
    typeof record.memoryText === "string" &&
    Array.isArray(record.visualTone) &&
    record.visualTone.every((item) => typeof item === "string") &&
    Array.isArray(record.songs) &&
    record.songs.every(isArchivedSong)
  );
}

function isOptionalStringArray(value: unknown) {
  return (
    value === undefined ||
    (Array.isArray(value) && value.every((item) => typeof item === "string"))
  );
}

function isArchivedSong(value: unknown): value is ArchivedSong {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;

  return (
    typeof record.trackId === "string" &&
    typeof record.title === "string" &&
    typeof record.artist === "string" &&
    typeof record.reason === "string" &&
    (typeof record.coverUrl === "string" || record.coverUrl === undefined) &&
    (typeof record.songUrl === "string" || record.songUrl === undefined)
  );
}
