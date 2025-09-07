import NextAuth from "next-auth";
import { authOptions } from "./server/next-auth-config";

declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError";
  }
}

declare module "next-auth" {
  interface JWT {
    access_token: string;
    expires_at: number | null;
    refresh_token?: string;
    error?: "RefreshTokenError";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
