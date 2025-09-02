// middleware.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/server/next-auth-config";

export default NextAuth(authOptions).auth;

export const config = {
  // Specify which paths the middleware should run on
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

// export const config = {
//   matcher: ["/dashboard/:path*", "/upload", "/videos/:path*"],
// };
