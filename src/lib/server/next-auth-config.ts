import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { prisma } from "./database";
import { comparePassword } from "@/lib/shared/password";
// import { email } from "zod";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Google requires "offline" access_type to provide a `refresh_token`
      authorization: { params: { access_type: "offline", prompt: "consent" } },
      allowDangerousEmailAccountLinking: true, // Enable automatic linking for Google
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "User identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        // const user = await prisma.user.findUnique({
        //   where: { username: credentials.username },
        // });

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: credentials.identifier },
              { email: credentials.identifier },
            ],
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValidPassword = await comparePassword(
          credentials.password,
          user.passwordHash as string
        );

        if (!isValidPassword) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: (user as any).username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }: any) {
      if (user) {
        token.user = user;
        token.id = user.id;
        (token as any).username = (user as any).username;
      }

      if (trigger === "update" && session) {
        token = { ...token, user: session };
        return token;
      }

      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at ?? null,
          refresh_token: account.refresh_token ?? token.refresh_token,
        };
      }

      const expiresAt = typeof token.expires_at === "number" ? token.expires_at : null;
      if (!expiresAt) {
        return token;
      }

      if (Date.now() < expiresAt * 1000) {
        return token;
      }

      if (!token.refresh_token) {
        token.error = "RefreshTokenError";
        return token;
      }

      try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: String(token.refresh_token),
          }),
        });

        const tokensOrError = await response.json();
        if (!response.ok) throw tokensOrError;

        const newTokens = tokensOrError as {
          access_token: string;
          expires_in: number;
          refresh_token?: string;
        };

        return {
          ...token,
          access_token: newTokens.access_token,
          expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
          refresh_token: newTokens.refresh_token ? newTokens.refresh_token : token.refresh_token,
        };
      } catch (error) {
        console.error("Error refreshing access_token", error);
        token.error = "RefreshTokenError";
        return token;
      }
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).username = (token as any).username as string;
      }
      session.error = token.error as "RefreshTokenError" | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/auth/signout",
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user'
  },
  secret: process.env.AUTH_SECRET,
};
