import { musicSeed } from "../data/music-seed";
import { generatedMusicLibrary } from "../lib/music-library.generated";
import { MUSIC_COVER_PLACEHOLDER } from "../lib/music-library";

type Report = {
  verified: number;
  invalidMetadata: number;
  missingCover: number;
  titleArtistMismatch: number;
  excluded: number;
};

const errors: string[] = [];
const warnings: string[] = [];
const seenTitleArtist = new Set<string>();
const seenSongIds = new Map<string, string[]>();
const seedsByKeyword = new Map(
  musicSeed.map((song) => [song.neteaseKeyword, song]),
);
const report: Report = {
  verified: 0,
  invalidMetadata: 0,
  missingCover: 0,
  titleArtistMismatch: 0,
  excluded: 0,
};

for (const song of generatedMusicLibrary) {
  const label = `${song.title || "(missing title)"} ${song.artist || ""}`.trim();
  const titleArtistKey = `${song.title}-${song.artist}`.toLowerCase();
  const songId = song.songId || song.neteaseSongId || "";
  const seed = seedsByKeyword.get(song.neteaseKeyword);
  const reasons: string[] = [];

  if (!song.title) reasons.push("title is required");
  if (!song.artist) reasons.push("artist is required");
  if (!song.neteaseKeyword) reasons.push("neteaseKeyword is required");
  if (!Array.isArray(song.spaceTags) || !song.spaceTags.length) reasons.push("spaceTags cannot be empty");
  if (!Array.isArray(song.sceneTags) || !song.sceneTags.length) reasons.push("sceneTags cannot be empty");
  if (!Array.isArray(song.emotionTags) || !song.emotionTags.length) reasons.push("emotionTags cannot be empty");
  if (!Array.isArray(song.memoryTags) || !song.memoryTags.length) reasons.push("memoryTags cannot be empty");
  if (!Array.isArray(song.visualTags) || !song.visualTags.length) reasons.push("visualTags cannot be empty");
  if (!Array.isArray(song.seasonTags) || !song.seasonTags.length) reasons.push("seasonTags cannot be empty");
  if (!Array.isArray(song.atmosphereTags) || !song.atmosphereTags.length) reasons.push("atmosphereTags cannot be empty");
  if (!Array.isArray(song.similarSpaces) || !song.similarSpaces.length) reasons.push("similarSpaces cannot be empty");
  if (!Array.isArray(song.timeTags)) reasons.push("timeTags must be an array");
  if (!Array.isArray(song.cityTags)) reasons.push("cityTags must be an array");
  if (!Array.isArray(song.socialContextTags)) reasons.push("socialContextTags must be an array");
  if (!Array.isArray(song.cultureTags)) reasons.push("cultureTags must be an array");
  if (!Array.isArray(song.musicSceneTags)) reasons.push("musicSceneTags must be an array");
  if (!Array.isArray(song.musicFeatures)) reasons.push("musicFeatures must be an array");
  if (!Array.isArray(song.lyricalThemes)) reasons.push("lyricalThemes must be an array");
  if (!Array.isArray(song.usageScenes)) reasons.push("usageScenes must be an array");
  if (!song.recommendationEvidence || typeof song.recommendationEvidence !== "object") {
    reasons.push("recommendationEvidence is required");
  } else {
    if (!Array.isArray(song.recommendationEvidence.space)) reasons.push("recommendationEvidence.space must be an array");
    if (!Array.isArray(song.recommendationEvidence.scene)) reasons.push("recommendationEvidence.scene must be an array");
    if (!Array.isArray(song.recommendationEvidence.music)) reasons.push("recommendationEvidence.music must be an array");
  }
  if (!song.recommendationReason) reasons.push("recommendationReason is required");
  if (typeof song.confidence !== "number") reasons.push("confidence is required");
  if (!song.memoryTypes?.length) reasons.push("memoryTypes cannot be empty");
  if (!song.scenes?.length) reasons.push("scenes cannot be empty");
  if (!song.emotions?.length) reasons.push("emotions cannot be empty");
  if (!song.description) reasons.push("description is required");
  if (!Array.isArray(song.visibleObjects)) reasons.push("visibleObjects must be an array");
  if (!Array.isArray(song.timeFeelings)) reasons.push("timeFeelings must be an array");
  if (!Array.isArray(song.colorFeelings)) reasons.push("colorFeelings must be an array");
  if (!Array.isArray(song.culturalSignals)) reasons.push("culturalSignals must be an array");
  if (!Array.isArray(song.avoidWhen)) reasons.push("avoidWhen must be an array");

  if (seenTitleArtist.has(titleArtistKey)) {
    reasons.push("duplicate title/artist");
  }
  seenTitleArtist.add(titleArtistKey);

  if (songId) {
    const labels = seenSongIds.get(songId) ?? [];
    labels.push(label);
    seenSongIds.set(songId, labels);
  }

  if (song.metadataVerified) {
    report.verified += 1;

    if (song.confidence < 0.65) {
      reasons.push("metadataVerified song requires confidence >= 0.65");
    }
    if (!song.musicSceneTags.length) {
      reasons.push("metadataVerified song requires musicSceneTags");
    }
    if (song.musicSceneTags.length > 5) {
      reasons.push("musicSceneTags must contain at most 5 tags");
    }
    if (!song.usageScenes.length) {
      reasons.push("metadataVerified song requires usageScenes");
    }
    if (!song.musicFeatures.length) {
      reasons.push("metadataVerified song requires musicFeatures");
    }
    if (song.musicSceneTags.length >= 5 && song.spaceTags.length >= 5) {
      reasons.push("song appears over-generic across too many spaces");
    }
    if (song.metadataSource !== "netease") {
      reasons.push("metadataVerified song must use metadataSource=netease");
    }
    if (!songId) {
      reasons.push("metadataVerified song requires songId or neteaseSongId");
    }
    if (!song.songUrl || !song.songUrl.includes(`id=${songId}`)) {
      reasons.push("songUrl must point to the current songId");
    }
    if (
      !song.coverUrl ||
      song.coverUrl === MUSIC_COVER_PLACEHOLDER ||
      song.coverUrl.includes("music-cover-placeholder")
    ) {
      report.missingCover += 1;
      reasons.push("metadataVerified song requires a real coverUrl");
    }
    if (seed && !metadataMatchesSeed(song.title, song.artist, seed)) {
      report.titleArtistMismatch += 1;
      reasons.push(
        `title/artist does not match seed "${seed.title} - ${seed.artist}" strongly enough`,
      );
    }
  } else {
    report.excluded += 1;
    warnings.push(
      `${label}: excluded from production pool (${song.unavailableReason || "metadata not verified"})`,
    );
  }

  if (reasons.length) {
    report.invalidMetadata += 1;
    errors.push(`${label}: ${reasons.join("; ")}.`);
  }
}

for (const [songId, labels] of seenSongIds) {
  if (labels.length > 1) {
    errors.push(`songId ${songId}: duplicated by ${labels.join(", ")}.`);
  }
}

void printReport();

function metadataMatchesSeed(
  title: string,
  artist: string,
  seed: { title: string; artist: string },
) {
  const metadataTitle = normalizeLookupText(title);
  const metadataArtist = normalizeLookupText(artist);
  const seedTitle = normalizeLookupText(seed.title);
  const seedArtist = normalizeLookupText(seed.artist);

  return (
    (!seedTitle ||
      metadataTitle.includes(seedTitle) ||
      seedTitle.includes(metadataTitle)) &&
    (!seedArtist || metadataArtist.includes(seedArtist))
  );
}

function normalizeLookupText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

async function validateRemoteCovers() {
  for (const song of generatedMusicLibrary) {
    if (!song.metadataVerified || !song.coverUrl) continue;

    const label = `${song.title} ${song.artist}`.trim();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(song.coverUrl, {
        method: "HEAD",
        signal: controller.signal,
      });

      if (!response.ok) {
        report.missingCover += 1;
        errors.push(`${label}: coverUrl is not reachable (${response.status}).`);
      }
    } catch (error) {
      report.missingCover += 1;
      errors.push(
        `${label}: coverUrl request failed (${
          error instanceof Error ? error.message : "unknown error"
        }).`,
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}

async function printReport() {
  if (process.env.MUSIC_VALIDATE_REMOTE === "true") {
    await validateRemoteCovers();
  } else {
    console.log("Remote cover probe: skipped (set MUSIC_VALIDATE_REMOTE=true to enable).");
  }

  console.log(`Verified: ${report.verified}`);
  console.log(`Invalid metadata: ${report.invalidMetadata}`);
  console.log(`Missing cover: ${report.missingCover}`);
  console.log(`Title/artist mismatch: ${report.titleArtistMismatch}`);
  console.log(`Excluded from production pool: ${report.excluded}`);

  if (warnings.length) {
    console.log("\nExcluded tracks:");
    console.log(warnings.join("\n"));
  }

  if (errors.length > 0) {
    console.error("\nValidation errors:");
    console.error(errors.join("\n"));
    process.exitCode = 1;
  }
}
