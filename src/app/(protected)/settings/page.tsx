"use client";

import { useSession } from "next-auth/react";
// import PortalHeader from "@/components/PortalHeader";
// import PortalFooter from "@/components/PortalFooter";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
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
        <h1 className="text-4xl font-bold text-gray-100">Settings</h1>
        <p className="mt-4 text-lg text-gray-50">
          Configure your account, preferences, and team access controls here.
        </p>
        <div className="mt-10">⚙️ Settings options coming soon.</div>
      </div>
      {/* <PortalFooter /> */}
    </>
  );
}
