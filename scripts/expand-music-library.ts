import { writeFile } from "node:fs/promises";
import path from "node:path";
import { spaceMemoryTaxonomy, type SpaceMemoryType } from "../lib/space-memory-taxonomy";
import { classifyMusicMemory, type ClassifiedMusicMemory } from "./classify-music-memory";
import type { MusicSong } from "../lib/music-library";
import { generatedMusicLibrary } from "../lib/music-library.generated";

type NeteaseSearchSong = {
  id?: number | string;
  name?: string;
  ar?: Array<{ name?: string }>;
  al?: { name?: string; picUrl?: string };
};

type RawSong = {
  songId: string;
  title: string;
  artist: string;
  coverUrl: string;
  album?: string;
};

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "lib/music-library.generated.ts");
const TARGET_PER_TYPE = 10;
const SEARCH_LIMIT = 8;
const EXISTING_IDS = new Set(generatedMusicLibrary.map((s) => s.id));

async function main() {
  const allSongs: MusicSong[] = [...generatedMusicLibrary];
  const seenSongIds = new Set<string>(
    generatedMusicLibrary
      .map((s) => s.neteaseSongId || s.songId)
      .filter((id): id is string => Boolean(id)),
  );

  for (const category of spaceMemoryTaxonomy) {
    const currentCount = allSongs.filter((s) =>
      s.memoryTypes.includes(category.id),
    ).length;
    if (currentCount >= TARGET_PER_TYPE) {
      console.log(`[${category.id}] ${currentCount}首, 跳过`);
      continue;
    }

    const needed = TARGET_PER_TYPE - currentCount;
    console.log(`[${category.id}] ${currentCount}首, 需要补充 ${needed}首`);

    const queries = buildSearchQueries(category);
    const rawSongs = await searchAndDeduplicate(queries, seenSongIds, needed + 5);
    console.log(`  搜索到 ${rawSongs.length} 首新歌`);

    for (const raw of rawSongs) {
      const classified = classifyMusicMemory({
        title: raw.title,
        artist: raw.artist,
        album: raw.album,
        playlistNames: [category.name],
      });

      // Ensure the song is assigned to the correct memory type from search context
      if (!classified.memoryTypes.includes(category.id)) {
        classified.memoryTypes = [category.id, ...classified.memoryTypes];
      }

      const id = slugify(`${raw.title}-${raw.artist}`);
      if (EXISTING_IDS.has(id)) continue;

      const song: MusicSong = {
        id,
        title: raw.title,
        artist: raw.artist,
        neteaseKeyword: `${raw.title} ${raw.artist.split(" / ")[0]}`,
        songId: raw.songId,
        neteaseSongId: raw.songId,
        coverUrl: raw.coverUrl,
        songUrl: `https://music.163.com/#/song?id=${raw.songId}`,
        album: raw.album,
        ...classified,
        metadataSource: "netease",
        metadataVerified: Boolean(raw.songId && raw.coverUrl),
        metadataCheckedAt: new Date().toISOString(),
        cityTags: [],
        timeTags: [],
        socialContextTags: [],
        cultureTags: [],
        musicSceneTags: [...new Set([...classified.sceneTags, ...classified.memoryTags])].slice(0, 5),
        musicFeatures: [],
        lyricalThemes: [],
        usageScenes: [...new Set([...classified.sceneTags, ...classified.memoryTags])].slice(0, 5),
        recommendationEvidence: {
          space: classified.visibleObjects.slice(0, 3),
          scene: classified.sceneTags.slice(0, 3),
          music: [],
        },
      };

      allSongs.push(song);
      EXISTING_IDS.add(id);
      seenSongIds.add(raw.songId);
      console.log(`  + ${raw.title} — ${raw.artist}`);
    }

    // Rate limit between categories
    await sleep(800);
  }

  await writeGeneratedLibrary(allSongs);
  console.log(`\n=== 完成 ===`);
  console.log(`总计: ${allSongs.length} 首歌`);

  const grouped: Record<string, number> = {};
  for (const s of allSongs) {
    for (const t of s.memoryTypes) {
      grouped[t] = (grouped[t] || 0) + 1;
    }
  }
  for (const [type, count] of Object.entries(grouped).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}首`);
  }
}

function buildSearchQueries(category: (typeof spaceMemoryTaxonomy)[number]): string[] {
  const queries: string[] = [];

  // Search by specific artists
  const artists = category.musicUniverse
    .filter((u) => !u.includes(" ") || u.length <= 6)
    .slice(0, 4);
  for (const artist of artists) {
    queries.push(artist);
  }

  // Search by genre/mood keywords
  const genres = category.musicUniverse
    .filter((u) => u.includes(" ") && u.length > 6)
    .slice(0, 2);
  for (const genre of genres) {
    queries.push(genre);
  }

  // Search by emotion + scene combinations
  const sceneTriggers = category.triggers.slice(0, 3);
  const emotions = category.emotions.slice(0, 2);
  for (const scene of sceneTriggers) {
    for (const emotion of emotions) {
      queries.push(`${scene} ${emotion}`);
    }
  }

  // Deduplicate queries, take unique ones (max 8)
  return [...new Set(queries)].slice(0, 8);
}

async function searchAndDeduplicate(
  queries: string[],
  seenSongIds: Set<string>,
  targetCount: number,
): Promise<RawSong[]> {
  const mod = await import("NeteaseCloudMusicApi");
  const cloudsearch =
    mod.cloudsearch ??
    (mod as { default?: { cloudsearch?: typeof mod.cloudsearch } }).default
      ?.cloudsearch;

  if (typeof cloudsearch !== "function") return [];

  const results = await Promise.all(
    queries.map(async (keyword) => {
      try {
        const result = (await cloudsearch({
          keywords: keyword,
          limit: SEARCH_LIMIT,
          type: 1,
        })) as { body?: { result?: { songs?: NeteaseSearchSong[] } } };

        return (result.body?.result?.songs ?? [])
          .map(normalizeSong)
          .filter((s): s is RawSong => s !== null && !seenSongIds.has(s.songId));
      } catch {
        return [];
      }
    }),
  );

  const seen = new Set(seenSongIds);
  const merged: RawSong[] = [];

  for (const batch of results) {
    for (const song of batch) {
      if (seen.has(song.songId)) continue;
      seen.add(song.songId);
      merged.push(song);
      if (merged.length >= targetCount) return merged;
    }
  }

  return merged;
}

function normalizeSong(song: NeteaseSearchSong): RawSong | null {
  const songId = song.id ? String(song.id) : "";
  const title = song.name?.trim() || "";
  const artist = (song.ar ?? [])
    .map((a) => a.name?.trim())
    .filter((a): a is string => Boolean(a))
    .join(" / ");

  if (!songId || !title) return null;

  let coverUrl = song.al?.picUrl || "";
  if (coverUrl.startsWith("//")) coverUrl = `https:${coverUrl}`;
  coverUrl = coverUrl.replace(/^http:\/\//, "https://") || "/music-cover-placeholder.jpg";

  return {
    songId,
    title,
    artist,
    coverUrl,
    album: song.al?.name?.trim() || undefined,
  };
}

async function writeGeneratedLibrary(songs: MusicSong[]) {
  const content = [
    'import type { MusicSong } from "@/lib/music-library";',
    "",
    "export const generatedMusicLibrary: MusicSong[] = ",
    JSON.stringify(songs, null, 2),
    ";",
    "",
  ].join("\n");

  await writeFile(OUTPUT_PATH, content);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
