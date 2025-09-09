import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/app/styles/app.css";
// import Script from "next/script";

import { NextAuthProvider } from "@/components/NextAuthProvider";
import GoogleOneTap from "@/components/GoogleOneTap";
// import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Video Campaign",
  description: "Video Campaign management portal.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth();

  return (
    <html lang="en">
      <head>
        {/* <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <div className="mx-auto">{children}</div>
          {/* Todo: enable one tap sign in after resolving issues */}
          {/* <GoogleOneTap /> */}
        </NextAuthProvider>
      </body>
    </html>
  );
}
