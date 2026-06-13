import { MUSIC_SCENE_COVERAGE_TARGETS, musicSceneTags } from "../data/music-scene-seeds";
import { generatedMusicLibrary } from "../lib/music-library.generated";
import { MUSIC_COVER_PLACEHOLDER } from "../lib/music-library";

type CoverageRow = {
  tag: string;
  count: number;
  target: number;
  risk: boolean;
};

const verified = generatedMusicLibrary.filter(isProductionReady);
const excluded = generatedMusicLibrary.filter((song) => !isProductionReady(song));
const duplicateSongIds = findDuplicates(
  generatedMusicLibrary
    .map((song) => song.songId || song.neteaseSongId)
    .filter((songId): songId is string => Boolean(songId)),
);
const duplicateTitleArtists = findDuplicates(
  generatedMusicLibrary.map((song) =>
    `${song.title} - ${song.artist}`.toLowerCase(),
  ),
);

const coverage: CoverageRow[] = musicSceneTags.map((tag) => {
  const count = verified.filter((song) => song.musicSceneTags.includes(tag)).length;
  const target = MUSIC_SCENE_COVERAGE_TARGETS[tag];

  return {
    tag,
    count,
    target,
    risk: count < 8,
  };
});

console.log(`Total records: ${generatedMusicLibrary.length}`);
console.log(`Verified records: ${verified.length}`);
console.log(`Excluded records: ${excluded.length}`);
console.log(`Duplicate songId records: ${duplicateSongIds.length}`);
console.log(`Duplicate title/artist records: ${duplicateTitleArtists.length}`);

console.log("\nCoverage by musicSceneTag:");
for (const row of coverage) {
  const status = row.risk ? "RISK" : row.count < row.target ? "LOW" : "OK";
  console.log(`${row.tag}: ${row.count} / ${row.target} (${status})`);
}

const risks = coverage.filter((row) => row.risk);
console.log("\nCoverage risks:");
if (risks.length) {
  for (const row of risks) {
    console.log(`- ${row.tag}: ${row.count} / ${row.target}`);
  }
} else {
  console.log("- none");
}

console.log("\nExcluded records:");
if (excluded.length) {
  for (const song of excluded) {
    console.log(
      `- ${song.title} - ${song.artist}: ${
        song.unavailableReason || "not production ready"
      }`,
    );
  }
} else {
  console.log("- none");
}

function isProductionReady(song: (typeof generatedMusicLibrary)[number]) {
  const songId = song.songId || song.neteaseSongId;

  return (
    song.metadataVerified === true &&
    song.metadataSource === "netease" &&
    song.confidence >= 0.65 &&
    song.musicSceneTags.length > 0 &&
    song.musicSceneTags.length <= 5 &&
    Boolean(songId) &&
    Boolean(song.songUrl?.includes(`id=${songId}`)) &&
    Boolean(song.coverUrl) &&
    song.coverUrl !== MUSIC_COVER_PLACEHOLDER
  );
}

function findDuplicates(values: string[]) {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(counts.entries()).filter(([, count]) => count > 1);
}
