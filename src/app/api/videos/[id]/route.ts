import { NextResponse } from "next/server";
import { db } from "@/lib/server/database";
import { auth } from "@/lib/auth";
import path from "node:path";
import fs from "node:fs/promises";

export async function DELETE(_: Request, { params }: any) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await db.user.findByEmail(session.user.email);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const video = await db.video.findById(params.id);
  if (!video || video.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Delete files under public/videos/{id} if present
  try {
    const publicDir = path.join(process.cwd(), "public", "videos", params.id);
    await fs.rm(publicDir, { recursive: true, force: true });
  } catch {}
  await db.video.delete(params.id);
  return NextResponse.json({ ok: true });
}

export async function GET(_: Request, { params }: any) {
  const video = await db.video.findById(params.id);
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(video);
}


