import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { musicSeed } from "../data/music-seed";
import { playlistSeed } from "../data/playlist-seed";
import { searchNeteaseSong, type NeteaseSongMetadata } from "../lib/netease";
import { classifyMusicMemoryWithQwen } from "./classify-music-memory";

type SeedSong = {
  title: string;
  artist: string;
  neteaseKeyword: string;
};

type MetadataCache = Record<string, NeteaseSongMetadata | null>;

const ROOT = process.cwd();
const CACHE_PATH = path.join(ROOT, "data/music-metadata-cache.json");
const OUTPUT_PATH = path.join(ROOT, "lib/music-library.generated.ts");

async function main() {
  await loadLocalEnv();
  await mkdir(path.join(ROOT, "data"), { recursive: true });
  const cache = await readMetadataCache();
  const seedSongs = collectSeedSongs();
  const generatedSongs = [];

  for (const seedSong of seedSongs) {
    const metadata = await lookupMetadata(seedSong, cache);
    const playlistNames = getPlaylistNames(seedSong.neteaseKeyword);
    const classified = await classifyMusicMemoryWithQwen({
      title: metadata?.title || seedSong.title,
      artist: metadata?.artist || seedSong.artist,
      album: metadata?.album,
      playlistNames,
    });

    generatedSongs.push({
      id: slugify(`${seedSong.title}-${seedSong.artist}`),
      title: metadata?.title || seedSong.title,
      artist: metadata?.artist || seedSong.artist,
      neteaseKeyword: seedSong.neteaseKeyword,
      ...(metadata?.songId ? { neteaseSongId: metadata.songId } : {}),
      ...(metadata?.coverUrl ? { coverUrl: metadata.coverUrl } : {}),
      ...(metadata?.album ? { album: metadata.album } : {}),
      ...classified,
    });

    await sleep(350);
  }

  await writeMetadataCache(cache);
  await writeGeneratedLibrary(generatedSongs);
}

async function loadLocalEnv() {
  const envPath = path.join(ROOT, ".env.local");

  try {
    const content = await readFile(envPath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // The script works without local env values; Qwen and metadata calls fall back.
  }
}

function collectSeedSongs() {
  const byKeyword = new Map<string, SeedSong>();

  for (const song of musicSeed) {
    byKeyword.set(song.neteaseKeyword, song);
  }

  for (const playlist of playlistSeed) {
    for (const songText of playlist.songs) {
      if (byKeyword.has(songText)) continue;

      const [title = songText, ...artistParts] = songText.split(/\s+/);
      const artist = artistParts.join(" ");
      byKeyword.set(songText, {
        title,
        artist,
        neteaseKeyword: songText,
      });
    }
  }

  return Array.from(byKeyword.values());
}

function getPlaylistNames(keyword: string) {
  return playlistSeed
    .filter((playlist) => playlist.songs.includes(keyword))
    .map((playlist) => playlist.name);
}

async function lookupMetadata(seedSong: SeedSong, cache: MetadataCache) {
  if (seedSong.neteaseKeyword in cache) {
    return cache[seedSong.neteaseKeyword];
  }

  const metadata = await searchNeteaseSong(seedSong.neteaseKeyword);
  cache[seedSong.neteaseKeyword] = metadata;
  return metadata;
}

async function readMetadataCache(): Promise<MetadataCache> {
  try {
    return JSON.parse(await readFile(CACHE_PATH, "utf8")) as MetadataCache;
  } catch {
    return {};
  }
}

async function writeMetadataCache(cache: MetadataCache) {
  await writeFile(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
}

async function writeGeneratedLibrary(songs: unknown[]) {
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
