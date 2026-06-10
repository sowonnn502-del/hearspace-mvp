import { NextResponse } from "next/server";
import { createMockMoodResult } from "@/lib/mockMood";
import { generateMoodWithQwen, getQwenVlModel } from "@/lib/qwen";

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image");
  const userNoteValue = formData.get("user_note");
  const userNote =
    typeof userNoteValue === "string" ? userNoteValue.trim().slice(0, 180) : "";
  const hasDashScopeApiKey = Boolean(process.env.DASHSCOPE_API_KEY);
  const allowMockFallback = process.env.HEARSPACE_ALLOW_MOCK === "true";
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

    if (!allowMockFallback) {
      return NextResponse.json(
        {
          error:
            "图片分析服务还没有接入：缺少 DASHSCOPE_API_KEY，无法生成基于图片的结果。",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      result: createMockMoodResult("mock_no_key"),
    });
  }

  try {
    const result = await generateMoodWithQwen({ image, userNote });

    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.error(error);
    console.log("[HearSpace AI] Fallback reason: mock_api_error");

    if (!allowMockFallback) {
      return NextResponse.json(
        {
          error:
            "图片分析服务调用失败，请检查 DASHSCOPE_API_KEY、QWEN_VL_MODEL 和网络配置。",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      result: createMockMoodResult("mock_api_error"),
    });
  }
}
