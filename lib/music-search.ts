type MusicSearchInput = {
  title: string;
  artist?: string;
  source?: string;
  mood?: string;
  keywords?: string[];
};

export type MusicSearchLinks = {
  youtubeUrl: string;
  neteaseUrl: string;
  spotifyUrl: string;
  query: string;
};

export function createMusicSearchLinks({
  title,
  artist,
  source,
  mood,
  keywords = [],
}: MusicSearchInput): MusicSearchLinks {
  const query = buildMusicSearchQuery({ title, artist, source, mood, keywords });
  const encodedQuery = encodeURIComponent(query);

  return {
    query,
    youtubeUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
    neteaseUrl: `https://music.163.com/#/search/m/?s=${encodedQuery}&type=1`,
    spotifyUrl: `https://open.spotify.com/search/${encodedQuery}`,
  };
}

function buildMusicSearchQuery({
  title,
  artist,
  source,
  mood,
  keywords = [],
}: MusicSearchInput) {
  const parts = [title, artist, source, mood, ...keywords]
    .filter((part): part is string => typeof part === "string")
    .map((part) => part.trim())
    .filter(Boolean);

  return Array.from(new Set(parts)).slice(0, 6).join(" ");
}
