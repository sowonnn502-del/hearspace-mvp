import { NextResponse } from "next/server";
import { createMockMoodResult } from "@/lib/mockMood";
import { generateMoodWithQwen, getQwenVlModel } from "@/lib/qwen";

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image");
  const hasDashScopeApiKey = Boolean(process.env.DASHSCOPE_API_KEY);
  const qwenVlModel = getQwenVlModel();

  console.log(`[HearSpace AI] DASHSCOPE_API_KEY loaded: ${hasDashScopeApiKey}`);
  console.log(`[HearSpace AI] QWEN_VL_MODEL: ${qwenVlModel}`);

  if (!(image instanceof File) || !image.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "A multipart image file is required." },
      { status: 400 },
    );
  }

  if (!hasDashScopeApiKey) {
    console.log("[HearSpace AI] Fallback reason: mock_no_key");

    return NextResponse.json({
      result: createMockMoodResult("mock_no_key"),
    });
  }

  try {
    const result = await generateMoodWithQwen({ image });

    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.error(error);
    console.log("[HearSpace AI] Fallback reason: mock_api_error");

    return NextResponse.json({
      result: createMockMoodResult("mock_api_error"),
    });
  }
}
