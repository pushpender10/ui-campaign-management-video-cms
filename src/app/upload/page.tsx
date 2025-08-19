"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [campaignStartDate, setCampaignStartDate] = useState("");
  const [campaignEndDate, setCampaignEndDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Please select a video file");
      return;
    }
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("campaignStartDate", campaignStartDate);
    form.append("campaignEndDate", campaignEndDate);
    form.append("file", file);
    setIsUploading(true);
    const res = await fetch("/api/videos", { method: "POST", body: form });
    setIsUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Upload failed");
      return;
    }
    const data = await res.json();
    router.push(`/videos/${data.id}`);
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Upload Video</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Campaign start</label>
            <input className="w-full border rounded px-3 py-2" type="date" value={campaignStartDate} onChange={(e)=>setCampaignStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Campaign end</label>
            <input className="w-full border rounded px-3 py-2" type="date" value={campaignEndDate} onChange={(e)=>setCampaignEndDate(e.target.value)} />
          </div>
        </div>
        <input className="w-full" type="file" accept="video/*" onChange={(e)=> setFile(e.target.files?.[0] ?? null)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={isUploading} className="bg-black text-white rounded px-4 py-2">{isUploading?"Uploading...":"Upload"}</button>
      </form>
    </div>
  );
}


