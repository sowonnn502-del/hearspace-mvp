import type { SpaceMemoryType } from "../lib/space-memory-taxonomy";
import type {
  MusicArchetype,
  MusicLightTone,
  MusicPace,
  MusicSeason,
} from "../lib/music-taxonomy";

export type ClassifiedMusicMemory = {
  memoryTypes: SpaceMemoryType[];
  scenes: string[];
  visibleObjects: string[];
  emotions: string[];
  timeFeelings: string[];
  colorFeelings: string[];
  culturalSignals: string[];
  avoidWhen: string[];
  season: MusicSeason;
  pace: MusicPace;
  lightTone: MusicLightTone;
  narrative: string;
  archetype: MusicArchetype;
  description: string;
};

type ClassifyInput = {
  title: string;
  artist: string;
  album?: string;
  playlistNames?: string[];
  existingTags?: string[];
};

const profiles: Array<{
  test: RegExp;
  value: ClassifiedMusicMemory;
}> = [
  {
    test: /校园|青春|教室|晴天|知足|遇见|那些年|蒲公英/,
    value: {
      memoryTypes: ["campus_youth"],
      scenes: ["教室", "校园", "操场", "窗边"],
      visibleObjects: ["课桌", "黑板", "窗户", "阳光"],
      emotions: ["青春", "怀念", "告别", "明亮"],
      timeFeelings: ["午后", "夏天"],
      colorFeelings: ["明亮", "暖色", "柔光"],
      culturalSignals: [],
      avoidWhen: ["餐厅", "霓虹", "中式园林"],
      season: "summer",
      pace: "medium",
      lightTone: "bright",
      narrative: "campus memory",
      archetype: "campus_memory",
      description: "像夏天放学后，阳光穿过教室窗边的空气。",
    },
  },
  {
    test: /公园|草地|恢复|奇妙能力歌|云烟成雨|夏日漱石|春风十里/,
    value: {
      memoryTypes: ["city_park_restorative"],
      scenes: ["公园", "草地", "散步", "城市绿地"],
      visibleObjects: ["草地", "树", "长椅", "阳光"],
      emotions: ["松弛", "自由", "轻盈", "恢复"],
      timeFeelings: ["午后", "春天", "夏天"],
      colorFeelings: ["绿色", "明亮", "柔光"],
      culturalSignals: [],
      avoidWhen: ["教室", "餐厅", "中式园林"],
      season: "spring",
      pace: "medium",
      lightTone: "bright",
      narrative: "restorative park",
      archetype: "restorative_park",
      description: "像城市绿地里慢慢散步，风把心事吹得轻一点。",
    },
  },
  {
    test: /深夜|城市|餐厅|水星记|普通朋友|好久不见|Under Lover|滞留锋/,
    value: {
      memoryTypes: ["night_city_dining"],
      scenes: ["餐厅", "夜路", "街角", "深夜城市"],
      visibleObjects: ["灯光", "酒杯", "餐桌", "霓虹"],
      emotions: ["城市", "微醺", "克制", "暧昧"],
      timeFeelings: ["夜晚", "深夜"],
      colorFeelings: ["暗色", "暖色", "蓝黑"],
      culturalSignals: [],
      avoidWhen: ["教室", "明亮花园", "草地"],
      season: "all",
      pace: "medium",
      lightTone: "dark",
      narrative: "city night",
      archetype: "city_night",
      description: "像夜晚餐桌旁的灯光，话没有说满，情绪刚好停住。",
    },
  },
  {
    test: /雨|窗边|独处|阴天|爱情转移|雨下一整晚/,
    value: {
      memoryTypes: ["rain_window_solitude"],
      scenes: ["窗边", "雨夜", "房间", "街道"],
      visibleObjects: ["雨", "玻璃", "路灯", "窗户"],
      emotions: ["独处", "思念", "低落", "安静"],
      timeFeelings: ["雨天", "夜晚", "雨后"],
      colorFeelings: ["灰蓝", "暗色", "冷色"],
      culturalSignals: [],
      avoidWhen: ["晴朗草地", "花园人像", "午后教室"],
      season: "all",
      pace: "slow",
      lightTone: "cool",
      narrative: "solitary window",
      archetype: "solitary_window",
      description: "像雨停在玻璃上，一个人坐在窗边听很久。",
    },
  },
  {
    test: /东方|庭院|水面|琵琶语|风居住的街道|繁花|林海|陈致逸/,
    value: {
      memoryTypes: ["chinese_garden_water"],
      scenes: ["庭院", "水面", "园林", "桥"],
      visibleObjects: ["亭台", "水面", "白墙", "瓦片"],
      emotions: ["留白", "清冷", "流动", "安静"],
      timeFeelings: ["清晨", "傍晚", "雨后"],
      colorFeelings: ["冷色", "低饱和"],
      culturalSignals: ["亭台", "水面", "白墙", "瓦片", "园林"],
      avoidWhen: ["普通花园", "餐厅", "教室", "花园人像"],
      season: "all",
      pace: "slow",
      lightTone: "cool",
      narrative: "water garden",
      archetype: "water_garden",
      description: "像水面把白墙和屋檐轻轻收住，留下一点安静的回声。",
    },
  },
  {
    test: /花园|柔光|梦幻|玫瑰|旅行的意义|小情歌|玫瑰少年|慢慢喜欢你/,
    value: {
      memoryTypes: ["flower_dream_portrait"],
      scenes: ["花园", "写真", "春日", "窗边"],
      visibleObjects: ["花", "玫瑰", "柔光", "裙子"],
      emotions: ["柔软", "梦幻", "喜欢", "明亮"],
      timeFeelings: ["春天", "午后"],
      colorFeelings: ["粉色", "柔光", "明亮"],
      culturalSignals: [],
      avoidWhen: ["中式园林", "深夜餐厅", "霓虹"],
      season: "spring",
      pace: "medium",
      lightTone: "soft",
      narrative: "soft garden",
      archetype: "soft_garden",
      description: "像花影轻轻晃动，春天把人留在柔光里。",
    },
  },
  {
    test: /日常|房间|居住|平凡的一天|生活倒影/,
    value: {
      memoryTypes: ["daily_life_home"],
      scenes: ["房间", "窗边", "日常", "桌子"],
      visibleObjects: ["桌子", "窗帘", "灯", "生活物件"],
      emotions: ["生活感", "温暖", "平静", "柔软"],
      timeFeelings: ["午后", "夜晚"],
      colorFeelings: ["暖色", "柔光"],
      culturalSignals: [],
      avoidWhen: ["霓虹", "中式园林", "操场"],
      season: "all",
      pace: "slow",
      lightTone: "warm",
      narrative: "daily room",
      archetype: "daily_room",
      description: "像普通房间里亮着一盏灯，生活慢慢安静下来。",
    },
  },
  {
    test: /旅行|远方|海边|想去海边/,
    value: {
      memoryTypes: ["travel_landscape"],
      scenes: ["海边", "旅途", "天空", "路上"],
      visibleObjects: ["天空", "海", "阳光", "车窗"],
      emotions: ["远方", "自由", "开阔", "告别"],
      timeFeelings: ["夏天", "午后"],
      colorFeelings: ["蓝色", "明亮"],
      culturalSignals: [],
      avoidWhen: ["中式园林", "深夜餐厅"],
      season: "summer",
      pace: "medium",
      lightTone: "bright",
      narrative: "traveling light",
      archetype: "traveling_light",
      description: "像夏天去海边的路上，天空把心情打开。",
    },
  },
];

export function classifyMusicMemory(input: ClassifyInput): ClassifiedMusicMemory {
  const text = [
    input.title,
    input.artist,
    input.album,
    ...(input.playlistNames ?? []),
    ...(input.existingTags ?? []),
  ]
    .filter(Boolean)
    .join(" ");
  const matched = profiles.find((profile) => profile.test.test(text));

  return matched?.value ?? {
    memoryTypes: ["unknown_soft_memory"],
    scenes: ["空间", "日常"],
    visibleObjects: ["光", "空气"],
    emotions: ["温柔", "安静", "怀念"],
    timeFeelings: ["此刻"],
    colorFeelings: ["柔光"],
    culturalSignals: [],
    avoidWhen: ["中式园林", "深夜餐厅"],
    season: "all",
    pace: "medium",
    lightTone: "neutral",
    narrative: "unknown soft memory",
    archetype: "unknown_soft_memory",
    description: "像一段模糊但柔和的空间记忆，被轻轻放在心里。",
  };
}

export async function classifyMusicMemoryWithQwen(
  input: ClassifyInput,
): Promise<ClassifiedMusicMemory> {
  if (process.env.MUSIC_USE_QWEN_CLASSIFIER !== "true") {
    return classifyMusicMemory(input);
  }

  const apiKey = process.env.DASHSCOPE_API_KEY;

  if (!apiKey) return classifyMusicMemory(input);

  try {
    const response = await fetch(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.QWEN_TEXT_MODEL || "qwen-plus",
          messages: [
            {
              role: "system",
              content:
                "你是 HearSpace 的中文空间音乐语义标注器。只输出 JSON，不要 markdown。",
            },
            {
              role: "user",
              content: buildQwenPrompt(input),
            },
          ],
          temperature: 0.35,
        }),
      },
    );

    if (!response.ok) throw new Error("Qwen classifier request failed.");

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    const parsed = content ? JSON.parse(extractJson(content)) : null;

    return normalizeClassifiedMusicMemory(parsed, classifyMusicMemory(input));
  } catch (error) {
    console.warn("[HearSpace Music] Qwen classifier fallback:", error);
    return classifyMusicMemory(input);
  }
}

function buildQwenPrompt(input: ClassifyInput) {
  return [
    "请根据歌曲信息，为 HearSpace 生成中文空间音乐语义标签。",
    "不要获取歌词，不要幻想具体歌词内容，只根据歌名、歌手、专辑、歌单名和常识性音乐语境标注。",
    "",
    `title: ${input.title}`,
    `artist: ${input.artist}`,
    `album: ${input.album || ""}`,
    `playlistNames: ${(input.playlistNames ?? []).join(" / ")}`,
    "",
    "输出 JSON 字段：",
    "memoryTypes, scenes, visibleObjects, emotions, timeFeelings, colorFeelings, culturalSignals, avoidWhen, season, pace, lightTone, narrative, archetype, description",
    "memoryTypes 只能从 campus_youth, city_park_restorative, night_city_dining, rain_window_solitude, chinese_garden_water, flower_dream_portrait, daily_life_home, travel_landscape, unknown_soft_memory 中选择。",
    "season 只能是 spring/summer/autumn/winter/all。",
    "pace 只能是 slow/medium/upbeat。",
    "lightTone 只能是 soft/warm/cool/dark/bright/neutral。",
    "description 必须是一句中文空间记忆描述。",
  ].join("\n");
}

function normalizeClassifiedMusicMemory(
  value: unknown,
  fallback: ClassifiedMusicMemory,
): ClassifiedMusicMemory {
  if (!value || typeof value !== "object") return fallback;

  const record = value as Partial<ClassifiedMusicMemory>;

  return {
    memoryTypes: normalizeStringArray(record.memoryTypes, fallback.memoryTypes) as SpaceMemoryType[],
    scenes: normalizeStringArray(record.scenes, fallback.scenes),
    visibleObjects: normalizeStringArray(record.visibleObjects, fallback.visibleObjects),
    emotions: normalizeStringArray(record.emotions, fallback.emotions),
    timeFeelings: normalizeStringArray(record.timeFeelings, fallback.timeFeelings),
    colorFeelings: normalizeStringArray(record.colorFeelings, fallback.colorFeelings),
    culturalSignals: normalizeStringArray(record.culturalSignals, fallback.culturalSignals),
    avoidWhen: normalizeStringArray(record.avoidWhen, fallback.avoidWhen),
    season: normalizeEnum(record.season, fallback.season, ["spring", "summer", "autumn", "winter", "all"]),
    pace: normalizeEnum(record.pace, fallback.pace, ["slow", "medium", "upbeat"]),
    lightTone: normalizeEnum(record.lightTone, fallback.lightTone, ["soft", "warm", "cool", "dark", "bright", "neutral"]),
    narrative: typeof record.narrative === "string" ? record.narrative : fallback.narrative,
    archetype: typeof record.archetype === "string" ? record.archetype as MusicArchetype : fallback.archetype,
    description:
      typeof record.description === "string" && record.description.trim()
        ? record.description.trim()
        : fallback.description,
  };
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;

  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return normalized.length ? normalized : fallback;
}

function normalizeEnum<T extends string>(
  value: unknown,
  fallback: T,
  allowed: readonly T[],
) {
  return typeof value === "string" && allowed.includes(value as T)
    ? (value as T)
    : fallback;
}

function extractJson(text: string) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match?.[1]) return match[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  return start >= 0 && end > start ? text.slice(start, end + 1) : text;
}

if (process.argv[1]?.endsWith("classify-music-memory.ts")) {
  const [title = "", artist = "", playlistName = ""] = process.argv.slice(2);
  console.log(
    JSON.stringify(
      classifyMusicMemory({ title, artist, playlistNames: [playlistName] }),
      null,
      2,
    ),
  );
}
