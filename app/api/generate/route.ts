import { NextResponse } from "next/server";
import { after } from "next/server";
import {
  createGenerationTask,
  startGenerationTask,
} from "@/lib/generation-task-store";

export const maxDuration = 30;

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image");
  const userNoteValue = formData.get("user_note");
  const userNote =
    typeof userNoteValue === "string" ? userNoteValue.trim().slice(0, 180) : "";

  if (!(image instanceof File) || !image.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "A multipart image file is required." },
      { status: 400 },
    );
  }

  const imageBuffer = await image.arrayBuffer();
  const imageForTask = new File([imageBuffer], image.name || "hearspace.jpg", {
    type: image.type,
  });
  const taskId = createGenerationTask({ image: imageForTask, userNote });
  after(async () => {
    await startGenerationTask(taskId, { image: imageForTask, userNote });
  });

  return NextResponse.json({ taskId });
}
