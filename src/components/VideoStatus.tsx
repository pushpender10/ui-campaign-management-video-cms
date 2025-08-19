"use client";
import { useEffect, useState } from "react";

type Props = { id: string; initial: { status: string; progressPercent: number } };

export default function VideoStatus({ id, initial }: Props) {
  const [status, setStatus] = useState(initial.status);
  const [progress, setProgress] = useState(initial.progressPercent ?? 0);

  useEffect(() => {
    if (status === "READY" || status === "FAILED") return;
    const es = new EventSource(`/api/videos/${id}/status`);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        setStatus(data.status);
        setProgress(data.progressPercent ?? 0);
        if (data.status === "READY" || data.status === "FAILED") {
          es.close();
        }
      } catch {}
    };
    return () => es.close();
  }, [id, status]);

  return (
    <p className="text-sm">Status: {status} {progress ? `(${progress}%)` : ""}</p>
  );
}


