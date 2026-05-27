import { getMusicCache, setMusicCache } from "@/lib/music-cache";
import { MUSIC_COVER_PLACEHOLDER } from "@/lib/music-library";

export type NeteaseSongMetadata = {
  songId?: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  songUrl: string;
};

type NeteaseCloudSearchSong = {
  id?: number | string;
  name?: string;
  ar?: Array<{ name?: string }>;
  artists?: Array<{ name?: string }>;
  al?: { picUrl?: string };
  album?: { name?: string; picUrl?: string };
};

type NeteaseCloudSearchResponse = {
  result?: {
    songs?: NeteaseCloudSearchSong[];
  };
};

const DEFAULT_NETEASE_API_BASE_URL =
  "https://netease-cloud-music-api.vercel.app";

async function tryHttpApi(keyword: string): Promise<NeteaseSongMetadata | null> {
  const apiBaseUrl = getNeteaseApiBaseUrl();
  const url = new URL("/cloudsearch", apiBaseUrl);
  url.searchParams.set("keywords", keyword);
  url.searchParams.set("limit", "1");
  url.searchParams.set("type", "1");

  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) throw new Error("Netease metadata request failed.");

  const data = (await response.json()) as NeteaseCloudSearchResponse;
  const firstSong = data.result?.songs?.[0];
  return firstSong ? normalizeNeteaseSong(firstSong) : null;
}

async function tryPackageApi(keyword: string): Promise<NeteaseSongMetadata | null> {
  try {
    const mod = await import("NeteaseCloudMusicApi");
    // Handle both ESM and CJS module shapes
    const cloudsearch = mod.cloudsearch ?? (mod as { default?: { cloudsearch?: typeof mod.cloudsearch } }).default?.cloudsearch;

    if (typeof cloudsearch !== "function") return null;

    const result = (await cloudsearch({ keywords: keyword, limit: 1, type: 1 })) as {
      body?: { result?: { songs?: NeteaseCloudSearchSong[] } };
    };
    const firstSong = result.body?.result?.songs?.[0];
    return firstSong ? normalizeNeteaseSong(firstSong) : null;
  } catch {
    return null;
  }
}

export async function searchNeteaseSong(
  keyword: string,
): Promise<NeteaseSongMetadata | null> {
  const normalizedKeyword = keyword.trim();

  if (!normalizedKeyword) return null;

  const cacheKey = `netease:song:${normalizedKeyword}`;
  const cached = getMusicCache<NeteaseSongMetadata | null>(cacheKey);

  if (cached !== undefined) return cached;

  // Try configured HTTP API first, then fall back to the bundled package
  let metadata: NeteaseSongMetadata | null = null;

  try {
    metadata = await tryHttpApi(normalizedKeyword);
  } catch {
    metadata = await tryPackageApi(normalizedKeyword);
  }

  if (metadata) {
    setMusicCache(cacheKey, metadata);
    return metadata;
  }

  console.warn("[HearSpace Music] Netease metadata lookup failed for:", normalizedKeyword);
  setMusicCache(cacheKey, null, 1000 * 60 * 10);
  return null;
}

function normalizeNeteaseSong(
  song: NeteaseCloudSearchSong,
): NeteaseSongMetadata | null {
  const songId = song.id ? String(song.id) : "";
  const title = song.name?.trim() || "";
  const artist = getArtists(song).join(" / ");
  const album = song.album?.name?.trim();
  const coverUrl = normalizeCoverUrl(song.al?.picUrl || song.album?.picUrl);

  if (!songId || !title) return null;

  return {
    songId,
    title,
    artist,
    ...(album ? { album } : {}),
    coverUrl,
    songUrl: `https://music.163.com/#/song?id=${songId}`,
  };
}

function getArtists(song: NeteaseCloudSearchSong) {
  return (song.ar || song.artists || [])
    .map((artist) => artist.name?.trim())
    .filter((artist): artist is string => Boolean(artist));
}

function normalizeCoverUrl(url?: string) {
  if (!url) return MUSIC_COVER_PLACEHOLDER;
  if (url.startsWith("//")) return `https:${url}`;
  return url.replace(/^http:\/\//, "https://");
}

function getNeteaseApiBaseUrl() {
  return (
    process.env.NETEASE_API_BASE_URL ||
    process.env.NEXT_PUBLIC_NETEASE_API_BASE_URL ||
    DEFAULT_NETEASE_API_BASE_URL
  );
}
