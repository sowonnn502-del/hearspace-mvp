import { NextResponse } from "next/server";
import { getGenerationTask } from "@/lib/generation-task-store";

type GenerateTaskStatusRouteProps = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: GenerateTaskStatusRouteProps,
) {
  const { taskId } = await params;
  const task = getGenerationTask(taskId);

  if (!task) {
    return NextResponse.json({ error: "Generation task not found." }, { status: 404 });
  }

  return NextResponse.json({
    stage: task.stage,
    partialResult: task.partialResult,
    musicRecommendations: task.musicRecommendations,
    error: task.error,
    updatedAt: task.updatedAt,
  });
}
