"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  return (
    <>
      {/* <PortalHeader /> */}
      <div className="min-h-screen max-w-6xl mx-auto px-6 py-20 text-white">
        <h1 className="text-4xl font-bold text-gray-100">Analytics</h1>
        <p className="mt-4 text-lg text-gray-50">
          Track and analyze the performance of your video campaigns in real
          time.
        </p>
        <div className="mt-10">📊 Analytics dashboard coming soon.</div>
      </div>
      {/* <PortalFooter /> */}
    </>
  );
}
