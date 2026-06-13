import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { musicSeed } from "../data/music-seed";
import { musicMetadataOverrides } from "../data/music-metadata-overrides";
import { musicSceneSeeds } from "../data/music-scene-seeds";
import { playlistSeed } from "../data/playlist-seed";
import { searchNeteaseSong, type NeteaseSongMetadata } from "../lib/netease";
import { classifyMusicMemoryWithQwen } from "./classify-music-memory";

type SeedSong = {
  title: string;
  artist: string;
  neteaseKeyword: string;
  musicSceneTags?: string[];
  preferredCultures?: string[];
  avoidCultures?: string[];
};

type MetadataCache = Record<string, NeteaseSongMetadata | null>;

const ROOT = process.cwd();
const CACHE_PATH = path.join(ROOT, "data/music-metadata-cache.json");
const OUTPUT_PATH = path.join(ROOT, "lib/music-library.generated.ts");

async function main() {
  await loadLocalEnv();
  await mkdir(path.join(ROOT, "data"), { recursive: true });
  const cache = await readMetadataCache();
  const seedSongs = collectSeedSongs();
  const generatedSongs = [];

  for (const seedSong of seedSongs) {
    const metadata = await lookupMetadata(seedSong, cache);
    const playlistNames = getPlaylistNames(seedSong.neteaseKeyword);
    const classified = await classifyMusicMemoryWithQwen({
      title: metadata?.title || seedSong.title,
      artist: metadata?.artist || seedSong.artist,
      album: metadata?.album,
      playlistNames,
    });

    generatedSongs.push({
      id: slugify(`${seedSong.title}-${seedSong.artist}`),
      title: metadata?.title || seedSong.title,
      artist: metadata?.artist || seedSong.artist,
      neteaseKeyword: seedSong.neteaseKeyword,
      songId: metadata?.songId,
      ...(metadata?.songId ? { neteaseSongId: metadata.songId } : {}),
      ...(metadata?.coverUrl ? { coverUrl: metadata.coverUrl } : {}),
      ...(metadata?.songUrl ? { songUrl: metadata.songUrl } : {}),
      ...(metadata?.album ? { album: metadata.album } : {}),
      ...classified,
      ...createAuthenticityFields(seedSong, metadata, classified),
    });

    await sleep(350);
  }

  await writeMetadataCache(cache);
  await writeGeneratedLibrary(generatedSongs);
}

async function loadLocalEnv() {
  const envPath = path.join(ROOT, ".env.local");

  try {
    const content = await readFile(envPath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // The script works without local env values; Qwen and metadata calls fall back.
  }
}

function collectSeedSongs() {
  const byKeyword = new Map<string, SeedSong>();

  for (const song of musicSeed) {
    byKeyword.set(song.neteaseKeyword, song);
  }

  for (const playlist of playlistSeed) {
    for (const songText of playlist.songs) {
      if (byKeyword.has(songText)) continue;

      const [title = songText, ...artistParts] = songText.split(/\s+/);
      const artist = artistParts.join(" ");
      byKeyword.set(songText, {
        title,
        artist,
        neteaseKeyword: songText,
      });
    }
  }

  for (const sceneSeed of musicSceneSeeds) {
    for (const song of sceneSeed.candidateSongs) {
      const neteaseKeyword = song.neteaseKeyword ?? `${song.title} ${song.artist}`;
      const current = byKeyword.get(neteaseKeyword);
      byKeyword.set(neteaseKeyword, {
        title: current?.title ?? song.title,
        artist: current?.artist ?? song.artist,
        neteaseKeyword,
        musicSceneTags: uniqueStrings([
          ...(current?.musicSceneTags ?? []),
          sceneSeed.musicSceneTag,
        ]),
        preferredCultures: uniqueStrings([
          ...(current?.preferredCultures ?? []),
          ...sceneSeed.preferredCultures,
        ]),
        avoidCultures: uniqueStrings([
          ...(current?.avoidCultures ?? []),
          ...sceneSeed.avoidCultures,
        ]),
      });
    }
  }

  return Array.from(byKeyword.values());
}

function getPlaylistNames(keyword: string) {
  return playlistSeed
    .filter((playlist) => playlist.songs.includes(keyword))
    .map((playlist) => playlist.name);
}

async function lookupMetadata(seedSong: SeedSong, cache: MetadataCache) {
  const override = musicMetadataOverrides.find(
    (item) => item.neteaseKeyword === seedSong.neteaseKeyword,
  );
  if (override && metadataMatchesSeed(override, seedSong)) {
    cache[seedSong.neteaseKeyword] = override;
    return override;
  }

  const cached = cache[seedSong.neteaseKeyword];

  if (cached && metadataMatchesSeed(cached, seedSong)) {
    return cached;
  }

  if (cached === null && process.env.MUSIC_RETRY_FAILED_METADATA === "false") {
    return cache[seedSong.neteaseKeyword];
  }

  const metadata = await searchNeteaseSong(seedSong.neteaseKeyword);
  if (metadata) {
    cache[seedSong.neteaseKeyword] = metadata;
    return metadata;
  }

  cache[seedSong.neteaseKeyword] = null;
  return null;
}

async function readMetadataCache(): Promise<MetadataCache> {
  try {
    return JSON.parse(await readFile(CACHE_PATH, "utf8")) as MetadataCache;
  } catch {
    return {};
  }
}

async function writeMetadataCache(cache: MetadataCache) {
  await writeFile(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function metadataMatchesSeed(metadata: NeteaseSongMetadata, seedSong: SeedSong) {
  const metadataTitle = normalizeLookupText(metadata.title);
  const metadataArtist = normalizeLookupText(metadata.artist);
  const seedTitle = normalizeLookupText(seedSong.title);
  const seedArtist = normalizeLookupText(seedSong.artist);

  return (
    (!seedTitle || metadataTitle.includes(seedTitle) || seedTitle.includes(metadataTitle)) &&
    (!seedArtist || metadataArtist.includes(seedArtist))
  );
}

function normalizeLookupText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

function createAuthenticityFields(
  seedSong: SeedSong,
  metadata: NeteaseSongMetadata | null,
  classified: Record<string, unknown>,
) {
  const verified = Boolean(
    metadata &&
      metadata.songId &&
      metadata.coverUrl &&
      metadata.songUrl &&
      metadata.songUrl.includes(`id=${metadata.songId}`) &&
      metadataMatchesSeed(metadata, seedSong),
  );

  return {
    metadataSource: metadata ? "netease" : "manual",
    metadataVerified: verified,
    metadataCheckedAt: new Date().toISOString(),
    ...(verified
      ? {}
      : {
          unavailableReason: metadata
            ? "Netease metadata did not match seed song strongly enough."
            : "Netease metadata missing.",
    }),
    confidence: deriveConfidence(seedSong, classified),
    timeTags: deriveTimeTags(classified),
    socialContextTags: deriveSocialContextTags(classified),
    cityTags: deriveCityTags(classified, seedSong),
    cultureTags: deriveCultureTags(seedSong, classified),
    musicSceneTags: deriveMusicSceneTags(seedSong, classified),
    musicFeatures: deriveMusicFeatures(classified),
    lyricalThemes: deriveLyricalThemes(classified),
    usageScenes: deriveUsageScenes(classified),
    recommendationEvidence: deriveRecommendationEvidence(classified, seedSong),
  };
}

function deriveTimeTags(classified: Record<string, unknown>) {
  const text = stringifySignals(classified, ["timeFeelings", "visualTags", "atmosphereTags"]);
  const tags = new Set<string>();

  if (/傍晚|黄昏|sunset|Golden Hour/i.test(text)) tags.add("Golden Hour");
  if (/深夜|夜|Low Light|Blue Hour|City Night/i.test(text)) tags.add("Late Night");
  if (/午后|afternoon|Slow Afternoon/i.test(text)) tags.add("Afternoon");
  if (/雨后|After Rain/i.test(text)) tags.add("After Rain");
  if (/放学|After School|毕业/i.test(text)) tags.add("After School");

  return Array.from(tags);
}

function deriveSocialContextTags(classified: Record<string, unknown>) {
  const text = stringifySignals(classified, ["memoryTags", "emotionTags", "emotions", "scenes"]);
  const tags = new Set<string>();

  if (/独处|一个人|Lonely|Solitude|Private Room/i.test(text)) tags.add("Alone");
  if (/等待|Waiting|候机/i.test(text)) tags.add("Waiting");
  if (/告别|Farewell|毕业/i.test(text)) tags.add("Farewell");
  if (/约会|Romantic|喜欢|First Love/i.test(text)) tags.add("Date");
  if (/日常|Daily Ritual|房间|厨房/i.test(text)) tags.add("Daily Ritual");
  if (/旅行|Long Trip|远方|车窗/i.test(text)) tags.add("Passing Through");

  return Array.from(tags);
}

function deriveCityTags(classified: Record<string, unknown>, seedSong: SeedSong) {
  const text = `${seedSong.musicSceneTags?.join(" ") ?? ""} ${stringifySignals(classified, [
    "scenes",
    "memoryTypes",
    "timeFeelings",
    "colorFeelings",
  ])}`;
  const tags = new Set<string>();

  if (/Convenience|Subway|Airport|Bus|Station|Office|Bridge|Night|深夜|夜|街|城市/i.test(text)) {
    tags.add("Late Night City");
  }
  if (/Convenience|商业|餐厅|便利店|Commercial/i.test(text)) tags.add("Commercial Corner");
  if (/Subway|Bus|Station|Airport|通勤|地铁|公交|车站|机场/i.test(text)) tags.add("Commuter City");
  if (/Hotel|酒店|陌生|Temporary/i.test(text)) tags.add("Temporary Stay");
  if (/Old Neighborhood|老街|旧|小区/i.test(text)) tags.add("Old Neighborhood");

  return Array.from(tags);
}

function deriveCultureTags(seedSong: SeedSong, classified: Record<string, unknown>) {
  const text = `${seedSong.artist} ${stringifySignals(classified, [
    "memoryTypes",
    "archetype",
    "description",
  ])}`;
  const tags = new Set<string>();

  if (/校园|campus|周杰伦|五月天|孙燕姿|胡夏/i.test(text)) tags.add("Mandopop Youth");
  if (/郭顶|陶喆|陈奕迅|落日飞车|deca|city|night/i.test(text)) tags.add("Chinese City Pop");
  if (/陈粒|房东的猫|陈绮贞|鹿先森|民谣|indie/i.test(text)) tags.add("Chinese Indie");
  if (/林海|陈致逸|古典|园林|庭院/i.test(text)) tags.add("Instrumental OST");
  if (/Ryuichi|Hisaishi|Sakamoto/i.test(text)) tags.add("Japanese OST");

  for (const culture of seedSong.preferredCultures ?? []) tags.add(culture);

  return Array.from(tags);
}

function deriveMusicSceneTags(seedSong: SeedSong, classified: Record<string, unknown>) {
  if (seedSong.musicSceneTags?.length) {
    return seedSong.musicSceneTags.slice(0, 4);
  }

  const tags = new Set<string>();
  const text = stringifySignals(classified, ["sceneTags", "memoryTags", "scenes"]);

  if (/Window|窗|雨/.test(text)) tags.add("Rainy Window");
  if (/Playground|After School|校园|操场|毕业/.test(text)) tags.add("Campus Sunset");
  if (/Park|草地|公园|长椅/.test(text)) tags.add("Park Grass / Bench");
  if (/Night Street|夜路|街角|深夜/.test(text)) tags.add("Night Street Walk");
  if (/Train Window|车窗|火车|列车/.test(text)) tags.add("Train Window");
  if (/Road Trip Sunset|海边|天空|远方/.test(text)) tags.add("Seaside Sunset");
  if (/Hotel|酒店|房间/.test(text)) tags.add("Hotel Room");
  if (/庭院|水面|园林|亭台/.test(text)) tags.add("Chinese Garden / Water");
  if (/花园|玫瑰|写真|柔光/.test(text)) tags.add("Soft Garden Portrait");

  return Array.from(tags).slice(0, 4);
}

function deriveConfidence(seedSong: SeedSong, classified: Record<string, unknown>) {
  const current =
    typeof classified.confidence === "number" && Number.isFinite(classified.confidence)
      ? classified.confidence
      : 0;

  if (seedSong.musicSceneTags?.length) {
    return Math.max(current, 0.72);
  }

  return current;
}

function deriveMusicFeatures(classified: Record<string, unknown>) {
  const text = stringifySignals(classified, ["pace", "lightTone", "description", "emotions"]);
  const features = new Set<string>();

  if (/slow|安静|柔|低落|思念/i.test(text)) features.add("soft vocal");
  if (/bright|明亮|轻盈|晴朗/i.test(text)) features.add("bright melody");
  if (/medium|青春|校园|民谣/i.test(text)) features.add("guitar arrangement");
  if (/city|霓虹|夜|微醺/i.test(text)) features.add("night city groove");
  if (/instrumental|古典|水面|留白/i.test(text)) features.add("instrumental texture");

  return Array.from(features);
}

function deriveLyricalThemes(classified: Record<string, unknown>) {
  const text = stringifySignals(classified, ["emotions", "memoryTags", "scenes", "description"]);
  const themes = new Set<string>();

  if (/青春|校园|毕业|放学|Youth|Graduation/i.test(text)) themes.add("youth memory");
  if (/等待|离开|告别|远方|旅行|Waiting|Farewell|Long Trip/i.test(text)) themes.add("leaving and waiting");
  if (/独处|房间|雨|思念|Rainy|Private Room/i.test(text)) themes.add("room solitude");
  if (/城市|夜|街|霓虹|city|night/i.test(text)) themes.add("city night");
  if (/海|天空|开阔|自由|远方/i.test(text)) themes.add("open travel");
  if (/日常|生活|公园|草地|恢复/i.test(text)) themes.add("daily healing");

  return Array.from(themes);
}

function deriveUsageScenes(classified: Record<string, unknown>) {
  const scenes = arraySignals(classified, "sceneTags");
  const memory = arraySignals(classified, "memoryTags");

  return [...new Set([...scenes, ...memory])].slice(0, 5);
}

function deriveRecommendationEvidence(
  classified: Record<string, unknown>,
  seedSong: SeedSong,
) {
  return {
    space: arraySignals(classified, "visibleObjects").slice(0, 3),
    scene: uniqueStrings([
      ...(seedSong.musicSceneTags ?? []),
      ...arraySignals(classified, "sceneTags"),
    ]).slice(0, 3),
    music: uniqueStrings([
      ...deriveMusicFeatures(classified),
      ...deriveLyricalThemes(classified),
    ]).slice(0, 3),
  };
}

function stringifySignals(record: Record<string, unknown>, keys: string[]) {
  return keys
    .flatMap((key) => {
      const value = record[key];
      return Array.isArray(value) ? value : [value];
    })
    .filter((value): value is string => typeof value === "string")
    .join(" ");
}

function arraySignals(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function uniqueStrings(values: Array<string | undefined>) {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
