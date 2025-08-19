import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

export type TranscodeProgress = {
  percent: number;
};

export async function transcodeToHls(inputPath: string, outputDirBase?: string, onProgress?: (p: TranscodeProgress) => void): Promise<{ manifestPath: string }>
{
  const outBase = outputDirBase ?? process.env.TRANSCODE_DIR ?? path.join(process.cwd(), "storage", "transcoded");
  const outputDir = path.join(outBase, path.parse(inputPath).name + "-" + Date.now());
  await fs.mkdir(outputDir, { recursive: true });
  const manifestPath = path.join(outputDir, "index.m3u8");

  // Basic HLS with single bitrate for brevity
  const args = [
    "-i", inputPath,
    "-preset", "veryfast",
    "-g", "48",
    "-sc_threshold", "0",
    "-f", "hls",
    "-hls_time", "4",
    "-hls_playlist_type", "vod",
    manifestPath,
  ];

  await new Promise<void>((resolve, reject) => {
    const child = spawn(ffmpegPath as string, args);
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (data: string) => {
      const timeMatch = data.match(/time=([\d:.]+)/);
      const outTime = timeMatch?.[1];
      if (outTime && onProgress) {
        // Cheap heuristic: we cannot know total duration without probing; skip exact percent.
        onProgress({ percent: 0 });
      }
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error("ffmpeg failed"));
    });
  });

  return { manifestPath };
}


