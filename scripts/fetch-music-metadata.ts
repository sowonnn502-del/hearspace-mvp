import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { searchNeteaseSong } from "../lib/netease";
import { generatedMusicLibrary } from "../lib/music-library.generated";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "lib/music-library.generated.ts");

async function main() {
  const updated: unknown[] = [];

  for (const song of generatedMusicLibrary) {
    // Skip songs that already have a cover URL and a song ID
    if (song.coverUrl && (song.neteaseSongId || song.songId)) {
      updated.push(song);
      console.log(`[skip] ${song.neteaseKeyword} — already has cover & id`);
      continue;
    }

    console.log(`[fetch] ${song.neteaseKeyword} ...`);
    const metadata = await searchNeteaseSong(song.neteaseKeyword);

    if (metadata) {
      updated.push({
        ...song,
        neteaseSongId: metadata.songId,
        songId: metadata.songId,
        coverUrl: metadata.coverUrl,
      });
      console.log(`  -> OK  ${metadata.songId}  ${metadata.coverUrl}`);
    } else {
      updated.push(song);
      console.log(`  -> FAILED`);
    }

    await sleep(500);
  }

  await writeGeneratedLibrary(updated);
  console.log(`\nDone. Updated ${updated.length} songs in ${OUTPUT_PATH}`);
}

async function writeGeneratedLibrary(songs: unknown[]) {
  const content = [
    'import type { MusicSong } from "@/lib/music-library";',
    "",
    "export const generatedMusicLibrary: MusicSong[] = ",
    JSON.stringify(songs, null, 2),
    ";",
    "",
  ].join("\n");

  await writeFile(OUTPUT_PATH, content);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
