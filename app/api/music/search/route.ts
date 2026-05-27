import { NextResponse } from "next/server";
import { fetchNeteaseMetadata } from "@/lib/netease-metadata";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const artist = typeof body.artist === "string" ? body.artist.trim() : "";

    if (!title || !artist) {
      return NextResponse.json(
        { error: "title and artist are required." },
        { status: 400 },
      );
    }

    const metadata = await fetchNeteaseMetadata({ title, artist });

    return NextResponse.json({
      id: metadata.id,
      title: metadata.title,
      artist: metadata.artist,
      album: metadata.album,
      coverImage: metadata.coverUrl,
      coverUrl: metadata.coverUrl,
      neteaseUrl: metadata.neteaseUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Music metadata lookup failed." },
      { status: 500 },
    );
  }
}
