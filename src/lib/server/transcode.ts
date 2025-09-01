import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';
import fs from 'fs/promises';

// Set ffmpeg path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export interface TranscodeOptions {
  inputPath: string;
  outputDir: string;
  videoId: string;
  onProgress?: (progress: number) => void;
}

export interface TranscodeResult {
  success: boolean;
  hlsManifestPath?: string;
  thumbnailPath?: string;
  duration?: number;
  error?: string;
}

export async function transcodeVideo(options: TranscodeOptions): Promise<TranscodeResult> {
  const { inputPath, outputDir, videoId, onProgress } = options;
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    const hlsManifestPath = path.join(outputDir, 'playlist.m3u8');
    const thumbnailPath = path.join(outputDir, 'thumbnail.jpg');
    
    return new Promise((resolve, reject) => {
      let duration = 0;
      
      // Get video duration first
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          reject({ success: false, error: 'Failed to read video metadata' });
          return;
        }
        
        duration = Math.round(metadata.format.duration || 0);
        
        // Generate thumbnail
        ffmpeg(inputPath)
          .screenshots({
            timestamps: ['50%'],
            filename: 'thumbnail.jpg',
            folder: outputDir,
            size: '1280x720'
          })
          .on('end', () => {
            // Start HLS transcoding
            ffmpeg(inputPath)
              .outputOptions([
                '-profile:v baseline',
                '-level 3.0',
                '-start_number 0',
                '-hls_time 10',
                '-hls_list_size 0',
                '-f hls'
              ])
              .output(hlsManifestPath)
              .on('progress', (progress) => {
                if (onProgress && duration > 0) {
                  const percent = Math.round((progress.percent || 0));
                  onProgress(percent);
                }
              })
              .on('end', () => {
                resolve({
                  success: true,
                  hlsManifestPath,
                  thumbnailPath,
                  duration
                });
              })
              .on('error', (err) => {
                reject({ success: false, error: err.message });
              })
              .run();
          })
          .on('error', (err) => {
            reject({ success: false, error: err.message });
          });
      });
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function generateThumbnail(inputPath: string, outputPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: ['50%'],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '1280x720'
      })
      .on('end', () => resolve(true))
      .on('error', () => resolve(false));
  });
}
