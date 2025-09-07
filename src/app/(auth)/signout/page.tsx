import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import Link from "next/link";

export default function SignOutPage() {
  return (
    <>
      <PortalHeader />
      <main className="min-h-screen max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          You’ve been signed out
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Thanks for using our Video CMS Campaign Management Portal.
        </p>
        <p className="mt-2 text-gray-500">
          To access your dashboard again, please sign in.
        </p>

        <Link
          href="/signin"
          className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          Sign In Again
        </Link>
      </main>
      <PortalFooter />
    </>
  );
}
