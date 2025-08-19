import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import VideoStatus from "@/components/VideoStatus";
export const dynamic = "force-dynamic";
import HlsPlayer from "@/components/HlsPlayer";

export default async function VideoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) return notFound();
  const canPlay = video.status === "READY" && video.hlsManifestPath;

  return (
    <div className="p-6 space-y-4">
      <Link href="/dashboard" className="underline">← Back</Link>
      <h1 className="text-2xl font-semibold">{video.title}</h1>
      <p className="text-gray-600">{video.description}</p>
      <p className="text-sm text-gray-500">Campaign: {video.campaignStartDate.toISOString().slice(0,10)} → {video.campaignEndDate.toISOString().slice(0,10)}</p>
      <VideoStatus id={video.id} initial={{ status: video.status, progressPercent: video.progressPercent }} />
      {canPlay ? (
        <HlsPlayer src={video.hlsManifestPath as string} />
      ) : (
        <div className="border rounded p-4">Video not ready yet.</div>
      )}
      <form action={`/api/videos/${video.id}`} method="post">
        <input type="hidden" name="_method" value="DELETE" />
        <button className="border rounded px-3 py-2" formMethod="delete">Delete</button>
      </form>
    </div>
  );
}


