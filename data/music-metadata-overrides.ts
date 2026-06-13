import type { NeteaseSongMetadata } from "@/lib/netease";

export type MusicMetadataOverride = NeteaseSongMetadata & {
  neteaseKeyword: string;
  note?: string;
};

export const musicMetadataOverrides: MusicMetadataOverride[] = [
  // Keep this file intentionally small. Overrides must still match the seed
  // title/artist and must pass validation before becoming production records.
  // Do not use overrides to paper over uncertain search results.
];
