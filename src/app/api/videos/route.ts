import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/database";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs/promises";

const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "storage", "uploads");

// privacy options
const privacyOptions = ["PUBLIC", "PRIVATE"] as const;

// video status options
const videoStatus = [
  "PENDING",
  "PROCESSING",
  "READY",
  "FAILED"
] as const;

const bodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category:z.string().optional().nullable(),
  privacy:z.enum(privacyOptions),
  hlsManifestPath:z.string().optional().nullable(),
  thumbnailPath:z.string().optional().nullable(),
  duration:z.number(),
  file_size:z.number(),
  status:z.enum(videoStatus),
  progressPercent:z.number(),
  errorMessage:z.string().optional().nullable(),
  campaignStartDate: z.string(),
  campaignEndDate: z.string(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();

  const json = Object.fromEntries(["title","description","campaignStartDate","campaignEndDate"].map((k) => [k, String(form.get(k) ?? "")]));
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File missing" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, "_")}`;
  const filePath = path.join(uploadDir, safeName);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filePath, buffer);

  const user = await db.user.findByEmail(session.user.email);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

  const video = await db.video.create({
    userId: user.id,
    title: parsed.data.title,
    description: parsed.data.description ?? undefined,
    category:parsed.data.category ?? undefined,
    privacy:parsed.data.privacy,
    originalFilePath: filePath,
    hlsManifestPath:parsed.data.hlsManifestPath ?? undefined,
    thumbnailPath:parsed.data.thumbnailPath ?? undefined,
    duration:parsed.data.duration,
    file_size:parsed.data.file_size,
    status:parsed.data.status,
    progressPercent:parsed.data.progressPercent,
    errorMessage:parsed.data.errorMessage ?? undefined,
    campaignStartDate: new Date(parsed.data.campaignStartDate),
    campaignEndDate: new Date(parsed.data.campaignEndDate),
  });

  // Kick off background transcoding via a separate route (SSE status elsewhere)
  const transcodeUrl = new URL(`/api/videos/${video.id}/transcode`, req.url);
  fetch(transcodeUrl.toString(), { method: "POST" }).catch(() => {});

  return NextResponse.json({ id: video.id });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}


