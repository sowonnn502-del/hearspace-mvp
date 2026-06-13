/**
 * Phase 3 Music Library Enrichment Script
 *
 * 1. Applies listenerEvidence from curated data to each song
 * 2. Reclassifies memoryTypes out of unknown_soft_memory
 * 3. Cleans artist and title metadata
 * 4. Reports changes
 *
 * Usage: npx tsx scripts/enrich-music-library-v3.ts
 */

import * as fs from "fs";
import * as path from "path";
import { listenerEvidenceMap, getListenerEvidence } from "../data/music-listener-evidence";
import { generatedMusicLibrary } from "../lib/music-library.generated";
import type { MusicSong, ListenerEvidence } from "../lib/music-library";

const LIBRARY_PATH = path.resolve(__dirname, "../lib/music-library.generated.ts");

// ── Artist/Title cleaning ──

function cleanArtistName(raw: string): string {
  // Remove known suffix patterns from NetEase search result contamination
  let cleaned = raw
    .replace(/\s*[-–—/|&,，、]\s*$/g, "")           // trailing separators
    .replace(/^\s*[-–—/|&,，、]\s*/g, "")            // leading separators
    .replace(/\s*\/\s*$/, "")                          // trailing slash
    .replace(/\s*\.\s*$/g, "")                         // trailing period
    .replace(/(\S)[-–—/|&,，、]\s*$/g, "$1")         // single char + separator at end
    .trim();

  // Fix specific patterns
  cleaned = cleaned
    .replace(/^Montagem\s*\/\s*/g, "")                // "Montagem / 周杰伦、" → "周杰伦"
    .replace(/^ALen\s*\/\s*/g, "")                     // "ALen / 周杰伦、" → "周杰伦"
    .replace(/^夏蔓蔓\s*\/\s*/g, "")                   // "夏蔓蔓 / 周杰伦." → "周杰伦"
    .replace(/^徐凤年\s*\/\s*/g, "")                   // "徐凤年 / 林宥嘉禾" → "林宥嘉禾"
    .replace(/^周华健\s*\/\s*/g, "")                   // "周华健 / 李宗盛" → "李宗盛"
    .replace(/^街道办GDC\s*\/\s*/g, "")                // NetEase search contamination
    .replace(/^欧阳耀莹\s*\.\s*\/?\s*/g, "")           // trailing contamination
    .replace(/\s*[-–—/|&,，、]\s*A-LNK\b/gi, "")      // "- / A-LNK" suffix
    .replace(/\s*[-–—/|&,，、]\s*Montagem\b/gi, "")   // "/ Montagem" suffix
    .replace(/\s*[-–—/|&,，、]\s*夏蔓蔓\b/g, "")       // "/ 夏蔓蔓" suffix
    .replace(/\s*[-–—/|&,，、]\s*ALen\b/gi, "")        // "ALen /" prefix
    .replace(/\s*\.\s*/g, "")                           // remaining periods
    .replace(/^\s*周杰伦[、，]\s*$/g, "周杰伦")        // "周杰伦、" → "周杰伦"
    .replace(/\s+/g, " ")                               // normalize spaces
    .trim();

  // If cleaning removed everything, restore original
  if (!cleaned || cleaned.length < 2) {
    // Try to extract a known artist name
    const known = [
      "周杰伦", "陈奕迅", "五月天", "孙燕姿", "王菲", "林宥嘉",
      "李宗盛", "梁博", "宋冬野", "田馥甄", "林俊杰", "莫文蔚",
    ];
    for (const name of known) {
      if (raw.includes(name)) return name;
    }
    return raw.replace(/[\s\/\-–—|&,，、.]+/g, " ").trim();
  }

  return cleaned;
}

function cleanTitleName(raw: string): string {
  return raw
    .replace(/\s*\(.*?(版|Version|Live|live|Mix|mix|Remix|remix|Edit|edit).*?\)\s*/g, "")
    .replace(/\s*（.*?(版|Version|Live|live|Mix|mix|Remix|remix|Edit|edit).*?）\s*/g, "")
    .replace(/\s*\([^)]*?(版|Version|Live|live)\s*\)\s*/g, "")
    .replace(/\s*（[^）]*?(版|Version|Live|live)\s*）\s*/g, "")
    .trim();
}

// ── Reclassification ──

const PRIMARY_SCENE_REMAP: Record<string, { memoryTypes: string[]; primaryMusicScene: string[] }> = {
  // Late Night Convenience Store → primary scene
  "爱人错过-告五人": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store"] },
  "披星戴月的想你-告五人": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store"] },
  "浪费-林宥嘉": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store", "Night Street Walk"] },
  "说谎-林宥嘉": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store", "Bus Stop"] },
  "你要的爱-戴佩妮": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store"] },
  "身骑白马-徐佳莹": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store"] },
  "寂寞烟火-蓝心羽": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store"] },
  "最佳损友-陈奕迅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store"] },
  "无人之境-陈奕迅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store", "Night Street Walk"] },
  "日落大道-梁博": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store", "Night Street Walk"] },
  "夜空中最亮的星-逃跑计划": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store"] },
  "别找我麻烦-蔡健雅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store"] },
  "晚安晚安-魏如萱": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store"] },
  "孤独患者-陈奕迅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store", "Bus Stop"] },
  "空白格-蔡健雅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store", "Rainy Window"] },
  "可乐-赵紫骅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Late Night Convenience Store", "Bus Stop"] },

  // Airport Waiting
  "平凡之路-朴树": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Airport Waiting", "Train Window"] },
  "南方姑娘-赵雷": { memoryTypes: ["daily_life_home"], primaryMusicScene: ["Old Neighborhood", "Park Grass / Bench"] },
  "成都-赵雷": { memoryTypes: ["daily_life_home"], primaryMusicScene: ["Old Neighborhood", "Park Grass / Bench"] },
  "再见-张震岳": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Airport Waiting", "Empty Station"] },
  "后来-刘若英": { memoryTypes: ["daily_life_home"], primaryMusicScene: ["Old Neighborhood", "Bus Stop"] },
  "路过人间-郁可唯": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Airport Waiting"] },
  "遥远的她-张学友": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Airport Waiting"] },
  "一万次悲伤-逃跑计划": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Empty Station"] },
  "蓝莲花-许巍": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Train Window", "Seaside Sunset"] },
  "漂洋过海来看你-李宗盛": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Airport Waiting", "Train Window"] },
  "山丘-李宗盛": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Office Night"] },
  "给自己的歌-李宗盛": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Office Night"] },
  "一路向北-周杰伦": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Airport Waiting", "Bus Stop"] },
  "匆匆那年-王菲": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset", "Old Neighborhood"] },
  "红豆-王菲": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Rainy Window", "Hotel Room"] },

  // Train Window
  "曾经的你-许巍": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Train Window"] },
  "故乡-许巍": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Train Window"] },
  "去大理-郝云": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Train Window"] },
  "生活不止眼前的苟且-许巍": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Train Window"] },
  "远在北方孤独的鬼-花粥": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Train Window"] },
  "安和桥-宋冬野": { memoryTypes: ["daily_life_home"], primaryMusicScene: ["Old Neighborhood", "Bridge / Overpass"] },
  "南山南-马頔": { memoryTypes: ["daily_life_home"], primaryMusicScene: ["Old Neighborhood", "Bridge / Overpass"] },
  "那些花儿-朴树": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset", "Old Neighborhood"] },
  "美好事物-房东的猫": { memoryTypes: ["city_park_restorative"], primaryMusicScene: ["Park Grass / Bench", "Seaside Sunset"] },
  "下一站茶山刘-房东的猫": { memoryTypes: ["city_park_restorative"], primaryMusicScene: ["Train Window", "Campus Sunset"] },
  "走马-陈粒": { memoryTypes: ["city_park_restorative"], primaryMusicScene: ["Park Grass / Bench"] },

  // Subway / Empty Metro
  "凄美地-郭顶": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Subway / Empty Metro", "Night Street Walk"] },
  "失落沙洲-徐佳莹": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Subway / Empty Metro", "Bus Stop"] },
  "突然好想你-五月天": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset", "Subway / Empty Metro"] },
  "让我留在你身边-陈奕迅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Subway / Empty Metro"] },
  "你就不要想起我-田馥甄": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Subway / Empty Metro", "Rainy Window"] },
  "地下铁-萧亚轩": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Subway / Empty Metro"] },
  "下一站天后-twins": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Subway / Empty Metro"] },
  "富士山下-陈奕迅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Subway / Empty Metro", "Night Street Walk"] },

  // Hotel Room
  "不要说话-陈奕迅": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Hotel Room", "Night Street Walk"] },
  "寂寞寂寞就好-田馥甄": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Hotel Room", "Rainy Window"] },
  "小半-陈粒": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Hotel Room", "Rainy Window"] },
  "房间-刘瑞琦": { memoryTypes: ["daily_life_home"], primaryMusicScene: ["Hotel Room"] },
  "我怀念的-孙燕姿": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Hotel Room", "Rainy Window"] },
  "开始懂了-孙燕姿": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Hotel Room", "Rainy Window"] },
  "解脱-张惠妹": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Hotel Room"] },
  "还是会寂寞-陈绮贞": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Hotel Room", "Rainy Window"] },
  "会呼吸的痛-梁静茹": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Hotel Room", "Rainy Window"] },
  "崇拜-梁静茹": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Hotel Room", "Rainy Window"] },

  // Seaside Sunset
  "有暖气-橘子海": { memoryTypes: ["city_park_restorative"], primaryMusicScene: ["Seaside Sunset"] },
  "起风了-买辣椒也用券": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Seaside Sunset"] },
  "忽然之间-莫文蔚": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Seaside Sunset"] },
  "小宇-张震岳": { memoryTypes: ["city_park_restorative"], primaryMusicScene: ["Seaside Sunset"] },
  "如果有来生-谭维维": { memoryTypes: ["city_park_restorative"], primaryMusicScene: ["Seaside Sunset"] },
  "海阔天空-beyond": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Seaside Sunset", "Empty Station"] },
  "光辉岁月-beyond": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Seaside Sunset"] },
  "旅行-许巍": { memoryTypes: ["travel_landscape"], primaryMusicScene: ["Seaside Sunset", "Train Window"] },
  "无与伦比的美丽-苏打绿": { memoryTypes: ["city_park_restorative"], primaryMusicScene: ["Seaside Sunset", "Park Grass / Bench"] },

  // Campus Sunset
  "小幸运-田馥甄": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset"] },
  "稻香-周杰伦": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset"] },
  "倔强-五月天": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset"] },
  "同桌的你-老狼": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset", "Old Neighborhood"] },
  "贝加尔湖畔-李健": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset", "Old Neighborhood"] },
  "我们的明天-鹿晗": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset"] },
  "七里香-周杰伦": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset"] },
  "不能说的秘密-周杰伦": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset"] },
  "等你下课-周杰伦": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset", "Bus Stop"] },
  "暖暖-梁静茹": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset", "Park Grass / Bench"] },
  "小手拉大手-梁静茹": { memoryTypes: ["campus_youth"], primaryMusicScene: ["Campus Sunset", "Park Grass / Bench"] },

  // Rainy Window
  "她说-林俊杰": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Rainy Window"] },
  "可惜没如果-林俊杰": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Rainy Window"] },
  "我也很想他-孙燕姿": { memoryTypes: ["rain_window_solitude"], primaryMusicScene: ["Rainy Window"] },

  // Night Street Walk
  "melody-陶喆": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Night Street Walk"] },
  "男孩-梁博": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Night Street Walk"] },
  "红色高跟鞋-蔡健雅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Night Street Walk", "Office Night"] },
  "记念-蔡健雅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Night Street Walk"] },
  "倒带-蔡依林": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Night Street Walk"] },

  // Park Grass / Bench
  "理想三旬-陈鸿宇": { memoryTypes: ["city_park_restorative"], primaryMusicScene: ["Park Grass / Bench", "Old Neighborhood"] },
  "董小姐-宋冬野": { memoryTypes: ["city_park_restorative"], primaryMusicScene: ["Park Grass / Bench", "Old Neighborhood"] },
  "岁月神偷-金玟岐": { memoryTypes: ["city_park_restorative"], primaryMusicScene: ["Park Grass / Bench", "Old Neighborhood"] },

  // Office Night
  "消愁-毛不易": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Office Night"] },
  "像我这样的人-毛不易": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Office Night"] },
  "达尔文-蔡健雅": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Office Night"] },
  "凡人歌-李宗盛": { memoryTypes: ["night_city_dining"], primaryMusicScene: ["Office Night"] },
};

// ── Main ──

interface EnrichReport {
  listenerEvidenceApplied: number;
  listenerEvidenceMissing: number;
  memoryTypesReclassified: number;
  artistsCleaned: string[];
  titlesCleaned: string[];
  unknownSoftMemoryBefore: number;
  unknownSoftMemoryAfter: number;
}

function main(): void {
  console.log("Phase 3 Enrichment — applying listenerEvidence, reclassifying memoryTypes, cleaning metadata\n");

  // Deep clone to avoid mutating the import
  const songs: MusicSong[] = JSON.parse(JSON.stringify(generatedMusicLibrary));
  const report: EnrichReport = {
    listenerEvidenceApplied: 0,
    listenerEvidenceMissing: 0,
    memoryTypesReclassified: 0,
    artistsCleaned: [],
    titlesCleaned: [],
    unknownSoftMemoryBefore: 0,
    unknownSoftMemoryAfter: 0,
  };

  // Count before
  for (const song of songs) {
    if (song.memoryTypes.includes("unknown_soft_memory")) {
      report.unknownSoftMemoryBefore++;
    }
  }

  // Apply enrichment
  for (const song of songs) {
    // 1. Apply listenerEvidence
    const evidence = getListenerEvidence(song.id);
    if (evidence && song.metadataVerified) {
      (song as Record<string, unknown>).listenerEvidence = evidence;
      report.listenerEvidenceApplied++;
    } else if (song.metadataVerified) {
      report.listenerEvidenceMissing++;
      console.log(`  WARNING: ${song.title} / ${song.artist} — no listenerEvidence`);
    }

    // 2. Clean artist name
    const originalArtist = song.artist;
    const cleanedArtist = cleanArtistName(song.artist);
    if (cleanedArtist !== originalArtist && cleanedArtist.length >= 2) {
      song.artist = cleanedArtist;
      report.artistsCleaned.push(`${originalArtist} → ${cleanedArtist}`);
    }

    // 3. Clean title
    const originalTitle = song.title;
    const cleanedTitle = cleanTitleName(song.title);
    if (cleanedTitle !== originalTitle && cleanedTitle.length >= 2) {
      song.title = cleanedTitle;
      report.titlesCleaned.push(`${originalTitle} → ${cleanedTitle}`);
    }

    // 4. Reclassify memoryTypes
    const remap = PRIMARY_SCENE_REMAP[song.id];
    if (remap) {
      song.memoryTypes = remap.memoryTypes as MusicSong["memoryTypes"];
      (song as Record<string, unknown>).primaryMusicScene = remap.primaryMusicScene;
      report.memoryTypesReclassified++;
    } else if (song.metadataVerified && song.musicSceneTags.length > 0) {
      // For songs NOT in the reclassification map, use their first musicSceneTag as primary
      (song as Record<string, unknown>).primaryMusicScene = [song.musicSceneTags[0]];
    }
  }

  // Count after
  for (const song of songs) {
    if (song.memoryTypes.includes("unknown_soft_memory")) {
      report.unknownSoftMemoryAfter++;
    }
  }

  // Write updated library
  const header = `import type { MusicSong } from "@/lib/music-library";

export const generatedMusicLibrary: MusicSong[] =
`;
  const updatedContent = header + JSON.stringify(songs, null, 2) + ";\n";
  fs.writeFileSync(LIBRARY_PATH, updatedContent, "utf-8");

  // Print report
  console.log("── Enrichment Report ──\n");
  console.log(`Listener evidence applied: ${report.listenerEvidenceApplied} / ${songs.filter((s) => s.metadataVerified).length}`);
  console.log(`Listener evidence missing: ${report.listenerEvidenceMissing}`);
  console.log(`Memory types reclassified: ${report.memoryTypesReclassified}`);
  console.log(`Unknown soft memory before: ${report.unknownSoftMemoryBefore} (${((report.unknownSoftMemoryBefore / songs.length) * 100).toFixed(1)}%)`);
  console.log(`Unknown soft memory after:  ${report.unknownSoftMemoryAfter} (${((report.unknownSoftMemoryAfter / songs.length) * 100).toFixed(1)}%)`);

  console.log(`\nArtist names cleaned: ${report.artistsCleaned.length}`);
  for (const entry of report.artistsCleaned) {
    console.log(`  ${entry}`);
  }

  console.log(`\nTitle names cleaned: ${report.titlesCleaned.length}`);
  for (const entry of report.titlesCleaned) {
    console.log(`  ${entry}`);
  }

  if (report.unknownSoftMemoryAfter > songs.filter((s) => s.metadataVerified).length * 0.2) {
    console.log(`\n⚠️  WARNING: unknown_soft_memory still > 20% of verified songs.`);
    console.log(`   Need further reclassification.`);
  }

  console.log("\n✓ Enrichment complete.");
}

main();
