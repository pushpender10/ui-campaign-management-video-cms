"use client";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

export default function HlsPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src]);
  return <video ref={ref} controls className="w-full max-w-4xl" />;
}


