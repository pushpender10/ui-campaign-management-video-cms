"use client";

import Link from "next/link";
import ErrorLayout from "@/components/ErrorLayout";

export default function GlobalError() {
  return (
    <html>
      <body>
        <ErrorLayout
          title="Something Went Wrong"
          tagline="💥 Our servers had a hiccup."
          message="An unexpected error occurred. Please try again later."
          imageSrc="/error-500.jpg"
          bgColor="bg-gray-100"
          actions={
            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              Back to Home
            </Link>
          }
        />
      </body>
    </html>
  );
}
