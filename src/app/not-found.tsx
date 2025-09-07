import Link from "next/link";
import ErrorLayout from "@/components/ErrorLayout";

export default function NotFound() {
  return (
    <ErrorLayout
      title="Page Not Found"
      tagline="🧭 Looks like you’re a little lost."
      message="Sorry, the page you’re looking for doesn’t exist or has been moved."
      imageSrc="/error-404.jpg"
      bgColor="bg-yellow-50"
      actions={
        <Link
          href="/"
          className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      }
    />
  );
}
