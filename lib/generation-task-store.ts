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

export function createGenerationTask(input: GenerationTaskInput) {
  cleanupGenerationTasks();

  const taskId = createTaskId();
  const now = Date.now();

  getTaskMap().set(taskId, {
    taskId,
    stage: "IMAGE_READY",
    partialResult: {},
    musicRecommendations: [],
    createdAt: now,
    updatedAt: now,
  });

  return taskId;
}

export function getGenerationTask(taskId: string) {
  cleanupGenerationTasks();
  return getTaskMap().get(taskId) ?? null;
}

export async function startGenerationTask(
  taskId: string,
  { image, userNote }: GenerationTaskInput,
) {
  try {
    const titleResult = await generateMoodTitleWithQwen({ image, userNote });
    updateGenerationTask(taskId, {
      stage: "TITLE_READY",
      partialResult: titleResult,
    });

    const fullResult = await generateMoodWithQwen({ image, userNote });
    updateGenerationTask(taskId, {
      stage: "MEMORY_READY",
      partialResult: fullResult,
    });

    const musicRecommendations = getMusicRecommendationPool(fullResult).slice(0, 3);
    updateGenerationTask(taskId, {
      stage: "MUSIC_READY",
      partialResult: fullResult,
      musicRecommendations,
    });

    updateGenerationTask(taskId, {
      stage: "SHARE_READY",
      partialResult: fullResult,
      musicRecommendations,
    });
  } catch (error) {
    updateGenerationTask(taskId, {
      error:
        error instanceof Error
          ? error.message
          : "这段空间暂时还没有被听见，请稍后再试。",
    });
  }
}

function updateGenerationTask(
  taskId: string,
  patch: Partial<Omit<GenerationTaskSnapshot, "taskId" | "createdAt">>,
) {
  const tasks = getTaskMap();
  const current = tasks.get(taskId);
  if (!current) return;

  tasks.set(taskId, {
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
