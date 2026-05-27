import { generatedMusicLibrary } from "../lib/music-library.generated";

const errors: string[] = [];
const seen = new Set<string>();

for (const song of generatedMusicLibrary) {
  const label = `${song.title || "(missing title)"} ${song.artist || ""}`.trim();
  const key = `${song.title}-${song.artist}`.toLowerCase();

  if (!song.title) errors.push(`${label}: title is required.`);
  if (!song.artist) errors.push(`${label}: artist is required.`);
  if (!song.neteaseKeyword) errors.push(`${label}: neteaseKeyword is required.`);
  if (!song.memoryTypes?.length) errors.push(`${label}: memoryTypes cannot be empty.`);
  if (!song.scenes?.length) errors.push(`${label}: scenes cannot be empty.`);
  if (!song.emotions?.length) errors.push(`${label}: emotions cannot be empty.`);
  if (!song.description) errors.push(`${label}: description is required.`);
  if (!Array.isArray(song.visibleObjects)) errors.push(`${label}: visibleObjects must be an array.`);
  if (!Array.isArray(song.timeFeelings)) errors.push(`${label}: timeFeelings must be an array.`);
  if (!Array.isArray(song.colorFeelings)) errors.push(`${label}: colorFeelings must be an array.`);
  if (!Array.isArray(song.culturalSignals)) errors.push(`${label}: culturalSignals must be an array.`);
  if (!Array.isArray(song.avoidWhen)) errors.push(`${label}: avoidWhen must be an array.`);

  if (seen.has(key)) {
    errors.push(`${label}: duplicate song.`);
  }

  seen.add(key);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${generatedMusicLibrary.length} generated music records.`);
}
