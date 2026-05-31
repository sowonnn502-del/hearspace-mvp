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
  al?: { name?: string; picUrl?: string };
  album?: { name?: string; picUrl?: string };
};

type NeteaseCloudSearchResponse = {
  result?: {
    songs?: NeteaseCloudSearchSong[];
  };
};

const DEFAULT_NETEASE_API_BASE_URL =
  "https://netease-cloud-music-api.vercel.app";
const SEARCH_LIMIT = 8;
const REQUEST_TIMEOUT_MS = 5_000;
const warnedKeywords = new Set<string>();

async function tryHttpApi(keyword: string): Promise<NeteaseSongMetadata | null> {
  const apiBaseUrl = getNeteaseApiBaseUrl();
  const url = new URL("/cloudsearch", apiBaseUrl);
  url.searchParams.set("keywords", keyword);
  url.searchParams.set("limit", String(SEARCH_LIMIT));
  url.searchParams.set("type", "1");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 },
      signal: controller.signal,
    });

    if (!response.ok) throw new Error("Netease metadata request failed.");

    const data = (await response.json()) as NeteaseCloudSearchResponse;
    const bestSong = selectBestSong(data.result?.songs ?? [], keyword);
    return bestSong ? normalizeNeteaseSong(bestSong) : null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function tryPackageApi(keyword: string): Promise<NeteaseSongMetadata | null> {
  try {
    const mod = await import("NeteaseCloudMusicApi");
    // Handle both ESM and CJS module shapes
    const cloudsearch = mod.cloudsearch ?? (mod as { default?: { cloudsearch?: typeof mod.cloudsearch } }).default?.cloudsearch;

    if (typeof cloudsearch !== "function") return null;

    const result = (await Promise.race([
      cloudsearch({ keywords: keyword, limit: SEARCH_LIMIT, type: 1 }),
      timeout(REQUEST_TIMEOUT_MS, null),
    ])) as {
      body?: { result?: { songs?: NeteaseCloudSearchSong[] } };
    } | null;
    const bestSong = selectBestSong(result?.body?.result?.songs ?? [], keyword);
    return bestSong ? normalizeNeteaseSong(bestSong) : null;
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

  warnLookupFailed(normalizedKeyword);
  setMusicCache(cacheKey, null, 1000 * 60 * 10);
  return null;
}

function normalizeNeteaseSong(
  song: NeteaseCloudSearchSong,
): NeteaseSongMetadata | null {
  const songId = song.id ? String(song.id) : "";
  const title = song.name?.trim() || "";
  const artist = getArtists(song).join(" / ");
  const album = song.al?.name?.trim() || song.album?.name?.trim();
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

function selectBestSong(songs: NeteaseCloudSearchSong[], keyword: string) {
  if (!songs.length) return null;

  const [titleToken = "", ...artistTokens] = keyword.split(/\s+/).filter(Boolean);
  const expectedTitle = normalizeSearchText(titleToken);
  const expectedArtist = normalizeSearchText(artistTokens.join(""));

  const bestSong = [...songs].sort((a, b) => {
    return scoreSearchSong(b, expectedTitle, expectedArtist) -
      scoreSearchSong(a, expectedTitle, expectedArtist);
  })[0];
  const bestArtist = normalizeSearchText(getArtists(bestSong).join(""));

  if (expectedArtist && !bestArtist.includes(expectedArtist)) {
    return null;
  }

  return bestSong;
}

function scoreSearchSong(
  song: NeteaseCloudSearchSong,
  expectedTitle: string,
  expectedArtist: string,
) {
  const title = normalizeSearchText(song.name ?? "");
  const artist = normalizeSearchText(getArtists(song).join(""));
  let score = 0;

  if (expectedTitle && title === expectedTitle) score += 8;
  else if (expectedTitle && (title.includes(expectedTitle) || expectedTitle.includes(title))) {
    score += 4;
  }

  if (expectedArtist && artist.includes(expectedArtist)) score += 7;
  if (song.al?.picUrl || song.album?.picUrl) score += 1;
  if (song.al?.name || song.album?.name) score += 1;

  return score;
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

function timeout<T>(ms: number, fallback: T) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms));
}

function warnLookupFailed(keyword: string) {
  if (warnedKeywords.has(keyword)) return;

  warnedKeywords.add(keyword);
  console.warn("[HearSpace Music] Netease metadata lookup failed for:", keyword);
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
