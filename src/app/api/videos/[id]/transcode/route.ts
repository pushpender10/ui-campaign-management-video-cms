import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transcodeToHls } from "@/lib/transcode";
import path from "node:path";
import fs from "node:fs/promises";

export async function POST(_: Request, { params }: any) {
  const video = await prisma.video.findUnique({ where: { id: params.id } });
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Update status to PROCESSING
  await prisma.video.update({ where: { id: video.id }, data: { status: "PROCESSING", progressPercent: 0 } });

  // Kick off async transcode without blocking response
  void (async () => {
    try {
      const { manifestPath } = await transcodeToHls(video.originalFilePath, process.env.TRANSCODE_DIR ?? undefined, (p) => {
        // Not accurate percent; set to 10 as heartbeat
        prisma.video.update({ where: { id: video.id }, data: { progressPercent: Math.min(90, (p.percent || 0)) } }).catch(() => {});
      });
      // Publish under public/videos/{id}
      const sourceDir = path.dirname(manifestPath);
      const publicDir = path.join(process.cwd(), "public", "videos", video.id);
      await fs.mkdir(publicDir, { recursive: true });
      // Fallback: copy files manually
      const entries = await fs.readdir(sourceDir, { withFileTypes: true });
      for (const entry of entries) {
        const src = path.join(sourceDir, entry.name);
        const dest = path.join(publicDir, entry.name);
        if (entry.isDirectory()) {
          await fs.mkdir(dest, { recursive: true });
          const sub = await fs.readdir(src);
          for (const name of sub) {
            await fs.copyFile(path.join(src, name), path.join(dest, name));
          }
        } else {
          await fs.copyFile(src, dest);
        }
      }
      const publicManifest = `/videos/${video.id}/index.m3u8`;
      await prisma.video.update({ where: { id: video.id }, data: { status: "READY", progressPercent: 100, hlsManifestPath: publicManifest } });
    } catch (e: any) {
      await prisma.video.update({ where: { id: video.id }, data: { status: "FAILED", errorMessage: String(e?.message ?? e) } });
    }
  })();

  return NextResponse.json({ ok: true });
}


