import { MUSIC_COVER_PLACEHOLDER } from "@/lib/music-library";
import { searchNeteaseSong } from "@/lib/netease";

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
  const metadata = await searchNeteaseSong(keyword);

  if (!metadata) {
    return {
      title,
      artist,
      coverUrl: MUSIC_COVER_PLACEHOLDER,
      neteaseUrl: `https://music.163.com/#/search/m/?s=${encodeURIComponent(keyword)}&type=1`,
    };
  }

  return {
    id: metadata.songId,
    title: metadata.title,
    artist: metadata.artist,
    coverUrl: metadata.coverUrl,
    neteaseUrl: metadata.songUrl,
  };
}
