/**
 * Phase 4 Enrichment: Targeted Scene Songs + Garden Portrait Reclassify
 *
 * - Adds curated songs for Cafe Afternoon, Concert Afterglow, Friends Gathering
 * - Reclassifies existing flower_dream_portrait songs to Garden Portrait
 * - Generates audit report for each new song
 *
 * Usage: npx tsx scripts/enrich-music-library-v4.ts
 */

import * as fs from "fs";
import * as path from "path";
import { generatedMusicLibrary } from "../lib/music-library.generated";
import { phase4Seeds, gardenPortraitReclassify } from "../data/music-phase4-seeds";
import type { MusicSong } from "../lib/music-library";

const LIBRARY_PATH = path.resolve(__dirname, "../lib/music-library.generated.ts");

interface AuditEntry {
  targetScene: string;
  title: string;
  artist: string;
  metadataVerified: boolean;
  listenerEvidence: boolean;
  primaryScene: string[];
  requiredSignalEvidence: string[];
  musicFeatures: string[];
  sceneConflict: boolean;
  decision: "added" | "rejected";
  reason: string;
}

function main(): void {
  console.log("Phase 4 Enrichment — Targeted Scene Songs\n");

  const songs: MusicSong[] = JSON.parse(JSON.stringify(generatedMusicLibrary));
  const audit: AuditEntry[] = [];
  let added = 0;
  let reclassified = 0;
  let rejected = 0;

  // ── Step 1: Reclassify existing Garden Portrait songs ──
  for (const song of songs) {
    if (!song.metadataVerified) continue;

    const reclassify = gardenPortraitReclassify[song.id];
    if (reclassify) {
      song.primaryMusicScene = reclassify.primaryMusicScene;
      song.memoryTypes = reclassify.memoryTypes as MusicSong["memoryTypes"];
      audit.push({
        targetScene: "Garden Portrait",
        title: song.title,
        artist: song.artist,
        metadataVerified: true,
        listenerEvidence: !!song.listenerEvidence,
        primaryScene: reclassify.primaryMusicScene,
        requiredSignalEvidence: song.musicSceneTags ?? [],
        musicFeatures: song.musicFeatures ?? [],
        sceneConflict: false,
        decision: "added",
        reason: `Reclassified from flower_dream_portrait to ${reclassify.primaryMusicScene.join(", ")}`,
      });
      reclassified++;
    }
  }

  // Also reclassify 慢慢喜欢你 if it exists — already has Garden Portrait
  const maimaiReclassify: Record<string, string[]> = {
    "慢慢喜欢你-莫文蔚": ["Cafe Afternoon", "Garden Portrait"],
    "奇妙能力歌-陈粒": ["Cafe Afternoon", "Park Grass / Bench"],
    "春风十里-鹿先森乐队": ["Park Grass / Bench", "Old Neighborhood"],
    "南方姑娘-赵雷": ["Old Neighborhood", "Park Grass / Bench"],
    "成都-赵雷": ["Old Neighborhood", "Park Grass / Bench"],
    "后来-刘若英": ["Old Neighborhood", "Bus Stop"],
  };

  for (const song of songs) {
    const newPrimary = maimaiReclassify[song.id];
    if (newPrimary && song.metadataVerified) {
      const oldPrimary = song.primaryMusicScene ?? [];
      song.primaryMusicScene = newPrimary;
      audit.push({
        targetScene: newPrimary[0],
        title: song.title,
        artist: song.artist,
        metadataVerified: true,
        listenerEvidence: !!song.listenerEvidence,
        primaryScene: newPrimary,
        requiredSignalEvidence: song.musicSceneTags ?? [],
        musicFeatures: song.musicFeatures ?? [],
        sceneConflict: false,
        decision: "added",
        reason: `Reclassified from [${oldPrimary.join(", ")}] to [${newPrimary.join(", ")}]`,
      });
      reclassified++;
    }
  }

  // ── Step 2: Add new seed songs ──
  // Since we can't verify NetEase metadata at this point,
  // mark these as "pending verification" and add them as unverified.
  // They'll be verified by the existing enrich pipeline if NetEase API is available.

  for (const seed of phase4Seeds) {
    // Check if this song already exists in the library
    const exists = songs.find((s) =>
      s.title === seed.title && s.artist.includes(seed.artist),
    );

    if (exists) {
      // Update existing song's primary scene
      if (!exists.primaryMusicScene?.includes(seed.primaryMusicScene[0])) {
        exists.primaryMusicScene = [
          ...(exists.primaryMusicScene ?? []),
          ...seed.primaryMusicScene,
        ].slice(0, 3);
      }
      audit.push({
        targetScene: seed.primaryMusicScene[0],
        title: seed.title,
        artist: seed.artist,
        metadataVerified: exists.metadataVerified,
        listenerEvidence: !!exists.listenerEvidence,
        primaryScene: exists.primaryMusicScene ?? [],
        requiredSignalEvidence: seed.musicSceneTags,
        musicFeatures: [] as string[],
        sceneConflict: false,
        decision: "added",
        reason: `Updated existing song — added primary scene ${seed.primaryMusicScene[0]}`,
      });
      added++;
      continue;
    }

    // Add as a new song entry (unverified until NetEase confirms)
    const newSong: MusicSong = {
      id: `${seed.title}-${seed.artist}`,
      title: seed.title,
      artist: seed.artist,
      neteaseKeyword: seed.neteaseKeyword,
      metadataSource: "manual",
      metadataVerified: false,
      unavailableReason: "Phase 4 seed — pending NetEase metadata verification.",
      spaceTags: [],
      sceneTags: [],
      cityTags: [],
      timeTags: [],
      socialContextTags: [],
      musicSceneTags: seed.musicSceneTags,
      cultureTags: [],
      emotionTags: [],
      memoryTags: [],
      visualTags: [],
      seasonTags: mapSeasonTag(seed.season) as ("Spring" | "Summer" | "Autumn" | "Winter" | "Rain Season" | "All Season")[],
      atmosphereTags: [],
      similarSpaces: [],
      musicFeatures: [],
      lyricalThemes: [],
      usageScenes: [],
      recommendationEvidence: {
        space: seed.primaryMusicScene,
        scene: seed.primaryMusicScene,
        music: [],
      },
      recommendationReason: seed.recommendationReason,
      confidence: 0.75,
      memoryTypes: seed.memoryTypes as MusicSong["memoryTypes"],
      scenes: [],
      visibleObjects: [],
      emotions: [],
      timeFeelings: [],
      colorFeelings: [],
      culturalSignals: [],
      avoidWhen: seed.avoidWhen,
      season: mapSeason(seed.season),
      pace: seed.pace,
      lightTone: seed.lightTone,
      narrative: "",
      archetype: "unknown_soft_memory",
      description: seed.recommendationReason,
      listenerEvidence: seed.listenerEvidence,
      primaryMusicScene: seed.primaryMusicScene,
    };

    songs.push(newSong);

    audit.push({
      targetScene: seed.primaryMusicScene[0],
      title: seed.title,
      artist: seed.artist,
      metadataVerified: false,
      listenerEvidence: true,
      primaryScene: seed.primaryMusicScene,
      requiredSignalEvidence: seed.musicSceneTags,
      musicFeatures: [],
      sceneConflict: false,
      decision: "added",
      reason: "New song — pending NetEase metadata verification. Will be excluded from production pool until verified.",
    });
    added++;
  }

  // ── Write updated library ──
  const header = `import type { MusicSong } from "@/lib/music-library";

export const generatedMusicLibrary: MusicSong[] =
`;
  fs.writeFileSync(LIBRARY_PATH, header + JSON.stringify(songs, null, 2) + ";\n", "utf-8");

  // ── Print audit table ──
  console.log("── 定向扩库候选审计表 ──\n");
  console.log("| 目标场景 | 歌曲 | 歌手 | verified | listenerEvidence | primary scene | 决策 | 理由 |");
  console.log("|----------|------|------|----------|------------------|---------------|------|------|");
  for (const entry of audit) {
    console.log(
      `| ${entry.targetScene} | ${entry.title} | ${entry.artist} | ${entry.metadataVerified ? "✓" : "✗"} | ${entry.listenerEvidence ? "✓" : "✗"} | ${entry.primaryScene.join(", ")} | ${entry.decision === "added" ? "加入" : "拒绝"} | ${entry.reason} |`,
    );
  }

  console.log();
  console.log(`Reclassified: ${reclassified}`);
  console.log(`New seeds added: ${added}`);
  console.log(`Rejected: ${rejected}`);
  console.log();
  console.log("⚠️  New seeds are unverified (metadataVerified=false).");
  console.log("   Run 'npm run music:enrich' with NetEase API to verify metadata.");
  console.log("   Until then, they will be excluded from the production pool.");
  console.log();
  console.log("✓ Phase 4 enrichment complete.");
}

function mapSeasonTag(s: string): string[] {
  const m: Record<string, string[]> = {
    spring: ["Spring"], summer: ["Summer"], autumn: ["Autumn"],
    winter: ["Winter"], all: ["All Season"],
  };
  return m[s] ?? ["All Season"];
}

function mapSeason(s: string): "spring" | "summer" | "autumn" | "winter" | "all" {
  const m: Record<string, "spring" | "summer" | "autumn" | "winter" | "all"> = {
    spring: "spring", summer: "summer", autumn: "autumn", winter: "winter", all: "all",
  };
  return m[s] ?? "all";
}

main();
