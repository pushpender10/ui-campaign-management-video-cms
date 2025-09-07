import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import { ReactNode } from "react";
import Image from "next/image";

interface ErrorLayoutProps {
  title: string;
  message: string;
  imageSrc?: string;
  actions?: ReactNode;
  bgColor?: string;
  tagline?: string; // new
}

export default function ErrorLayout({
  title,
  message,
  imageSrc = "/placeholder.jpg",
  actions,
  bgColor = "bg-gray-50",
  tagline,
}: ErrorLayoutProps) {
  return (
    <>
      <PortalHeader />
      <main
        className={`${bgColor} min-h-screen max-w-5xl mx-auto flex flex-col items-center justify-center px-6 py-20 text-center`}
      >
        {/* Graphic */}
        <div className="relative w-64 h-64 mb-8">
          <Image
            src={imageSrc}
            alt="Error Illustration"
            fill
            className="object-contain rounded-xl shadow-lg"
          />
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-red-600">{title}</h1>

        {/* Tagline */}
        {tagline && (
          <p className="mt-2 text-xl font-medium text-gray-800">{tagline}</p>
        )}

        {/* Message */}
        <p className="mt-6 text-lg text-gray-600 max-w-xl">{message}</p>

        {/* Actions */}
        {actions && <div className="mt-10 flex gap-4">{actions}</div>}
      </main>
      <PortalFooter />
    </>
  );
}
