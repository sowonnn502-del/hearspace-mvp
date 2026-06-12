import {
  getMusicRecommendationPool,
  type MusicMemoryRecommendation,
} from "@/lib/music-library";
import type { MoodResult } from "@/lib/mood-schema";
import {
  generateMoodTitleWithQwen,
  generateMoodWithQwen,
} from "@/lib/qwen";
import type { ResultProgressStage } from "@/components/ResultProgressContext";

export type GenerationTaskSnapshot = {
  taskId: string;
  stage: ResultProgressStage;
  partialResult: Partial<MoodResult>;
  musicRecommendations: MusicMemoryRecommendation[];
  error?: string;
  createdAt: number;
  updatedAt: number;
};

type GenerationTaskInput = {
  image: File;
  userNote?: string;
};

const TASK_TTL_MS = 1000 * 60 * 30;
const TASK_TTL_SECONDS = Math.floor(TASK_TTL_MS / 1000);

type GlobalWithTasks = typeof globalThis & {
  __hearspaceGenerationTasks?: Map<string, GenerationTaskSnapshot>;
};

function getTaskMap() {
  const globalWithTasks = globalThis as GlobalWithTasks;
  if (!globalWithTasks.__hearspaceGenerationTasks) {
    globalWithTasks.__hearspaceGenerationTasks = new Map();
  }

  return globalWithTasks.__hearspaceGenerationTasks;
}

export async function createGenerationTask(input: GenerationTaskInput) {
  cleanupGenerationTasks();

  const taskId = createTaskId();
  const now = Date.now();
  const snapshot: GenerationTaskSnapshot = {
    taskId,
    stage: "IMAGE_READY",
    partialResult: {},
    musicRecommendations: [],
    createdAt: now,
    updatedAt: now,
  };

  await writeGenerationTask(snapshot);

  return taskId;
}

export async function getGenerationTask(taskId: string) {
  cleanupGenerationTasks();
  return readGenerationTask(taskId);
}

export async function startGenerationTask(
  taskId: string,
  { image, userNote }: GenerationTaskInput,
) {
  try {
    const titleResult = await generateMoodTitleWithQwen({ image, userNote });
    await updateGenerationTask(taskId, {
      stage: "TITLE_READY",
      partialResult: titleResult,
    });

    const fullResult = await generateMoodWithQwen({ image, userNote });
    await updateGenerationTask(taskId, {
      stage: "MEMORY_READY",
      partialResult: fullResult,
    });

    const musicRecommendations = getMusicRecommendationPool(fullResult).slice(0, 3);
    await updateGenerationTask(taskId, {
      stage: "MUSIC_READY",
      partialResult: fullResult,
      musicRecommendations,
    });

    await updateGenerationTask(taskId, {
      stage: "SHARE_READY",
      partialResult: fullResult,
      musicRecommendations,
    });
  } catch (error) {
    await updateGenerationTask(taskId, {
      error:
        error instanceof Error
          ? error.message
          : "这段空间暂时还没有被听见，请稍后再试。",
    });
  }
}

async function updateGenerationTask(
  taskId: string,
  patch: Partial<Omit<GenerationTaskSnapshot, "taskId" | "createdAt">>,
) {
  const current = await readGenerationTask(taskId);
  if (!current) return;

  await writeGenerationTask({
    ...current,
    ...patch,
    partialResult: {
      ...current.partialResult,
      ...(patch.partialResult ?? {}),
    },
    musicRecommendations:
      patch.musicRecommendations ?? current.musicRecommendations,
    updatedAt: Date.now(),
  });
}

async function readGenerationTask(taskId: string) {
  const kvTask = await readTaskFromKv(taskId);
  if (kvTask) return kvTask;

  return getTaskMap().get(taskId) ?? null;
}

async function writeGenerationTask(snapshot: GenerationTaskSnapshot) {
  getTaskMap().set(snapshot.taskId, snapshot);
  await writeTaskToKv(snapshot);
}

async function readTaskFromKv(taskId: string) {
  const endpoint = getKvEndpoint();
  if (!endpoint) return null;

  try {
    const response = await fetch(
      `${endpoint.url}/get/${encodeURIComponent(taskKey(taskId))}`,
      {
        headers: {
          Authorization: `Bearer ${endpoint.token}`,
        },
        cache: "no-store",
      },
    );
    if (!response.ok) return null;

    const payload = (await response.json()) as { result?: string | null };
    if (!payload.result) return null;

    return JSON.parse(payload.result) as GenerationTaskSnapshot;
  } catch (error) {
    console.warn("[HearSpace Task] KV read failed:", error);
    return null;
  }
}

async function writeTaskToKv(snapshot: GenerationTaskSnapshot) {
  const endpoint = getKvEndpoint();
  if (!endpoint) return;

  try {
    await fetch(`${endpoint.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${endpoint.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        [
          "SET",
          taskKey(snapshot.taskId),
          JSON.stringify(snapshot),
          "EX",
          TASK_TTL_SECONDS,
        ],
      ]),
    });
  } catch (error) {
    console.warn("[HearSpace Task] KV write failed:", error);
  }
}

function getKvEndpoint() {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_REST_API_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_REST_API_TOKEN;

  if (!url || !token) return null;

  return {
    url: url.replace(/\/+$/, ""),
    token,
  };
}

function taskKey(taskId: string) {
  return `hearspace:generation:${taskId}`;
}

function createTaskId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function cleanupGenerationTasks() {
  const now = Date.now();

  for (const [taskId, task] of getTaskMap()) {
    if (now - task.createdAt > TASK_TTL_MS) {
      getTaskMap().delete(taskId);
    }
  }
}
