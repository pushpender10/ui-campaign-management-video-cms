import Image from "next/image";
export const dynamic = "force-dynamic";

import PortalHeader from "@/components/PortalHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Video, BarChart3, Users } from "lucide-react";

export default function Home() {
  return (
    // <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    <>
    

    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Manage Your Video Campaigns <br />
          <span className="text-indigo-600">Smarter & Faster</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Our Video CMS Portal helps you plan, launch, and track video
          campaigns with ease. Get real-time insights and streamline your
          content workflow.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="px-8 py-6 text-lg">
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg flex items-center gap-2"
          >
            Learn More <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
          <CardHeader>
            <Video className="w-10 h-10 text-indigo-600" />
            <CardTitle className="mt-4 text-xl">Video Library</CardTitle>
          </CardHeader>
          <CardContent>
            Store, organize, and manage all your campaign videos in one secure
            place with easy access.
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
          <CardHeader>
            <BarChart3 className="w-10 h-10 text-indigo-600" />
            <CardTitle className="mt-4 text-xl">Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            Track views, engagement, and performance metrics with real-time
            dashboards.
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
          <CardHeader>
            <Users className="w-10 h-10 text-indigo-600" />
            <CardTitle className="mt-4 text-xl">Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            Share campaigns, assign roles, and collaborate with your entire
            team seamlessly.
          </CardContent>
        </Card>
      </section>

      {/* Preview / Placeholder Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Campaign Preview</h2>
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/preview.jpg"
            alt="Video CMS preview"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 py-16 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Power Your Campaigns?
        </h2>
        <p className="mb-6 text-lg">
          Join today and make your video marketing workflow effortless.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="px-8 py-6 text-lg font-semibold"
        >
          Start Free Trial
        </Button>
      </section>
    </main>
  </>
    // </div>
  );
}