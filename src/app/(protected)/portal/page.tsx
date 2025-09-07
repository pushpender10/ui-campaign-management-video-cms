import { auth } from "@/lib/auth";
import Link from "next/link";
import { db } from "@/lib/server/database";
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

export default async function PortalPage() {
  const session = await auth();

  console.log("Session in portal page:", session);

  if (!session?.user?.id) {
    return redirect("/signin");
  }

  const user = await db.user.findByEmail(session?.user?.id ?? "");

  const videos = await db.video.findByUserId(user?.id ?? "");

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Videos</h1>
        <Link href="/upload" className="underline">
          Upload new
        </Link>
      </div>
      <ul className="space-y-2">
        {videos.map((v: any) => (
          <li
            key={v.id}
            className="border rounded p-3 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{v.title}</p>
              <p className="text-sm text-gray-500">
                Status: {v.status}{" "}
                {v.progressPercent ? `(${v.progressPercent}%)` : ""}
              </p>
              <p className="text-xs text-gray-500">
                Campaign: {v.campaignStartDate.toISOString().slice(0, 10)} →{" "}
                {v.campaignEndDate.toISOString().slice(0, 10)}
              </p>
            </div>
            <div className="flex gap-3">
              <Link className="underline" href={`/videos/${v.id}`}>
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
