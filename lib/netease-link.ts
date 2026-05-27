type NeteaseLinkInput = {
  title?: string;
  artist?: string;
  keywords?: string[];
  mood?: string;
  neteaseKeyword?: string;
};

export type NeteaseLink = {
  query: string;
  url: string;
};

export function createNeteaseMusicLink({
  title,
  artist,
  keywords = [],
  mood,
  neteaseKeyword,
}: NeteaseLinkInput): NeteaseLink {
  const query = neteaseKeyword?.trim() || buildNeteaseQuery({ title, artist, keywords, mood });
  const encodedQuery = encodeURIComponent(query);

  return {
    query,
    url: `https://music.163.com/#/search/m/?s=${encodedQuery}&type=1`,
  };
}

function buildNeteaseQuery({
  title,
  artist,
  keywords = [],
  mood,
}: NeteaseLinkInput) {
  const parts = [title, artist, ...keywords, mood]
    .filter((part): part is string => typeof part === "string")
    .map((part) => part.trim())
    .filter(Boolean);

  const uniqueParts = Array.from(new Set(parts));

  return uniqueParts.slice(0, 5).join(" ") || "氛围 音乐";
}
