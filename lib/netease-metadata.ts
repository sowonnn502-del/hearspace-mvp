import * as cheerio from "cheerio";

export const NETEASE_DEFAULT_COVER =
  "https://s4.music.126.net/style/web2/img/default/default_album.jpg";

export type NeteaseMusicMetadata = {
  id?: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  neteaseUrl: string;
};

type FetchNeteaseMetadataInput = {
  title: string;
  artist: string;
};

export async function fetchNeteaseMetadata({
  title,
  artist,
}: FetchNeteaseMetadataInput): Promise<NeteaseMusicMetadata> {
  const keyword = [title, artist].filter(Boolean).join(" ").trim();
  const neteaseUrl = createNeteaseSongSearchUrl(keyword);

  try {
    const html = await fetchNeteaseSearchHtml(keyword);
    const parsed = parseNeteaseSearchHtml(html, { title, artist });

    return {
      id: parsed.id,
      title: parsed.title || title,
      artist: parsed.artist || artist,
      album: parsed.album,
      coverUrl: parsed.coverUrl || NETEASE_DEFAULT_COVER,
      neteaseUrl: parsed.id
        ? `https://music.163.com/#/song?id=${parsed.id}`
        : neteaseUrl,
    };
  } catch {
    return {
      title,
      artist,
      coverUrl: NETEASE_DEFAULT_COVER,
      neteaseUrl,
    };
  }
}

function createNeteaseSongSearchUrl(keyword: string) {
  return `https://music.163.com/#/search/m/?s=${encodeURIComponent(keyword)}&type=1`;
}

async function fetchNeteaseSearchHtml(keyword: string) {
  const response = await fetch(
    `https://music.163.com/search/m/?s=${encodeURIComponent(keyword)}&type=1`,
    {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
        referer: "https://music.163.com/",
      },
      next: { revalidate: 60 * 60 * 24 },
    },
  );

  if (!response.ok) throw new Error("Netease search page request failed.");

  return response.text();
}

function parseNeteaseSearchHtml(
  html: string,
  fallback: FetchNeteaseMetadataInput,
) {
  const $ = cheerio.load(html);
  const firstSongLink = $('a[href^="/song?id="], a[href*="song?id="]').first();
  const id = extractSongId(firstSongLink.attr("href"));
  const title =
    firstSongLink.attr("title")?.trim() ||
    firstSongLink.text().trim() ||
    fallback.title;
  const row = firstSongLink.closest("tr, li, .item, .srchsongst");
  const rowText = row.text().replace(/\s+/g, " ").trim();
  const artist =
    row.find('a[href^="/artist?id="], a[href*="artist?id="]').first().text().trim() ||
    fallback.artist;
  const album =
    row.find('a[href^="/album?id="], a[href*="album?id="]').first().text().trim() ||
    extractAlbumFromText(rowText);
  const coverUrl =
    row.find("img").first().attr("src") ||
    html.match(/https?:\/\/p\d+\.music\.126\.net\/[^"'<>\\]+?\.jpg/)?.[0];

  return {
    id,
    title,
    artist,
    album,
    coverUrl: normalizeImageUrl(coverUrl),
  };
}

function extractSongId(href?: string) {
  return href?.match(/song\?id=(\d+)/)?.[1];
}

function extractAlbumFromText(text: string) {
  const match = text.match(/《([^》]+)》/);
  return match?.[1];
}

function normalizeImageUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("//")) return `https:${url}`;
  return url.replace(/\?.*$/, "");
}
