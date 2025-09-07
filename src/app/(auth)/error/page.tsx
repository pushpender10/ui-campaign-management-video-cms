import Link from "next/link";
import ErrorLayout from "@/components/ErrorLayout";

export default function AuthErrorPage() {
  return (
    <ErrorLayout
      title="Authentication Error"
      tagline="🔒 Access denied, but don’t worry!"
      message="Oops! Something went wrong while trying to sign you in. This could be due to an expired session, invalid credentials, or a misconfigured login provider."
      imageSrc="/error-auth.jpg"
      bgColor="bg-red-50"
      actions={
        <>
          <Link
            href="/signin"
            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-gray-200 px-6 py-3 text-gray-800 font-semibold shadow hover:bg-gray-300 transition"
          >
            Go Home
          </Link>
        </>
      }
    />
  );
}
