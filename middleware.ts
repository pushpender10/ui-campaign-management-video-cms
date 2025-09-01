import { authOptions } from "@/lib/server/next-auth-config"
import NextAuth from "next-auth"
import { NextRequest } from "next/server";
// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/server/next-auth-config";

 
// Use only one of the two middleware options below
// 1. Use middleware directly
export const { auth: middleware } = NextAuth(authOptions)

export const config = {
  matcher: ["/dashboard/:path*", "/upload", "/videos/:path*"],
};

 
// 2. Wrapped middleware option
// const { auth } = NextAuth(authOptions)
// export default auth(async function middleware(req: NextRequest) {
//   // Your custom middleware logic goes here
// })