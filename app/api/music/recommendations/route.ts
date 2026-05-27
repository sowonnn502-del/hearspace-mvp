import { NextResponse } from "next/server";
import type { MoodResult } from "@/lib/mood-schema";
import { searchMusicByMood } from "@/lib/music-search";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const result = (await request.json()) as MoodResult;
    const recommendations = await searchMusicByMood(result);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.warn("[HearSpace Music] Dynamic recommendation failed:", error);
    return NextResponse.json(
      { error: "Music recommendation lookup failed." },
      { status: 500 },
    );
  }
}
