import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs/promises";

const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "storage", "uploads");

const bodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
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

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

  const video = await prisma.video.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      description: parsed.data.description ?? undefined,
      originalFilePath: filePath,
      campaignStartDate: new Date(parsed.data.campaignStartDate),
      campaignEndDate: new Date(parsed.data.campaignEndDate),
    },
  });

  // Kick off background transcoding via a separate route (SSE status elsewhere)
  const transcodeUrl = new URL(`/api/videos/${video.id}/transcode`, req.url);
  fetch(transcodeUrl.toString(), { method: "POST" }).catch(() => {});

  return NextResponse.json({ id: video.id });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}


