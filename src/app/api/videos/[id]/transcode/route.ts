import { NextResponse } from "next/server";
import { db } from "@/lib/server/database";
import { transcodeVideo } from "@/lib/server/transcode";
import path from "node:path";
import fs from "node:fs/promises";

export async function POST(_: Request, { params }: any) {
  const video = await db.video.findById(params.id);
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Update status to PROCESSING
  await db.video.update(video.id, { status: "PROCESSING", progressPercent: 0 });

  // Kick off async transcode without blocking response
  void (async () => {
    try {
      const outputDir = path.join(process.cwd(), "storage", "transcoded", `${video.id}-${Date.now()}`);
      
      const result = await transcodeVideo({
        inputPath: video.originalFilePath,
        outputDir,
        videoId: video.id,
        onProgress: (progress) => {
          // Update progress
          db.video.update(video.id, { progressPercent: Math.min(90, progress) }).catch(() => {});
        }
      });

      if (!result.success) {
        throw new Error(result.error || 'Transcoding failed');
      }

      // Publish under public/videos/{id}
      const publicDir = path.join(process.cwd(), "public", "videos", video.id);
      await fs.mkdir(publicDir, { recursive: true });
      
      // Copy transcoded files to public directory
      if (result.hlsManifestPath) {
        const sourceDir = path.dirname(result.hlsManifestPath);
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
      }

      // Copy thumbnail if generated
      if (result.thumbnailPath) {
        const thumbnailDest = path.join(publicDir, 'thumbnail.jpg');
        await fs.copyFile(result.thumbnailPath, thumbnailDest);
      }

      const publicManifest = `/videos/${video.id}/playlist.m3u8`;
      const thumbnailPath = result.thumbnailPath ? `/videos/${video.id}/thumbnail.jpg` : null;
      
      await db.video.update(video.id, { 
        status: "READY", 
        progressPercent: 100, 
        hlsManifestPath: publicManifest,
        thumbnailPath,
        duration: result.duration || video.duration
      });
    } catch (e: any) {
      await db.video.update(video.id, { 
        status: "FAILED", 
        errorMessage: String(e?.message ?? e) 
      });
    }
  })();

  return NextResponse.json({ ok: true });
}


