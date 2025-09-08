import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "@auth/core/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "./database";
import { comparePassword } from "@/lib/shared/password";
// import { email } from "zod";

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

const googleAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export const adapter: Adapter = PrismaAdapter(prisma);

export const authOptions: NextAuthConfig = {
  adapter: adapter,
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
        // Support Google One Tap via ID token through the same provider
        idToken: { label: "Google One Tap ID Token", type: "text" },
        googleOneTap: { label: "Google One Tap flag", type: "text" },
      },
      async authorize(credentials) {
        console.log("CredentialsProvider authorize", {
          hasIdentifier: !!credentials?.identifier,
          hasPassword: !!credentials?.password,
          hasIdToken: !!(credentials as any)?.idToken,
        });

        // 1) Google One Tap path (ID token based)
        const idToken = (credentials as any)?.idToken as string | undefined;
        if (idToken) {
          try {
            const ticket = await googleAuthClient.verifyIdToken({
              idToken,
              audience: process.env.GOOGLE_CLIENT_ID!,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
              console.warn("One Tap: missing payload or email");
              return null;
            }

            // const email = String(payload.email).toLowerCase().trim();
            // const name = payload.name ?? null;
            // const image = payload.picture ?? null;

            const {
              email,
              sub,
              given_name,
              family_name,
              picture: image,
              email_verified,
            } = payload;
            if (!email) {
              throw new Error("Email not available");
            }

            // Find or create the user by email
            let user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
              // Generate a username from email local part, ensure uniqueness
              const baseUsername = email
                .split("@")[0]
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "_");
              const tryUsernames = [
                baseUsername,
                `${baseUsername}_1`,
                `${baseUsername}_${Math.random().toString(36).slice(2, 6)}`,
              ];
              let finalUsername: string | null = null;
              for (const candidate of tryUsernames) {
                const existing = await prisma.user.findUnique({
                  where: { username: candidate },
                });
                if (!existing) {
                  finalUsername = candidate;
                  break;
                }
              }

              user = await prisma.user.create({
                data: {
                  email,
                  name: [given_name, family_name].join(" ") ?? undefined,
                  image: image ?? undefined,
                  emailVerified: email_verified ? new Date() : null,
                  username: finalUsername ?? undefined,
                },
              });
            }

            // The user may already exist, but maybe it signed up with a different provider. With the next few lines of code
            // we check if the user already had a Google account associated, and if not we create one.
            const account = await adapter.getUserByAccount!({
              provider: "google",
              providerAccountId: sub,
            });

            console.log("todo: linkAccount?", { userId: user.id, account });

            if (!account && user) {
              console.log("creating and linking account");
              await adapter.linkAccount!({
                userId: user.id,
                provider: "google",
                providerAccountId: sub,
                type: "oauth",
              });
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              username: (user as any).username,
            };
          } catch (err) {
            console.error("One Tap verifyIdToken failed", err);
            return null;
          }
        }

        // 2) Traditional credentials path
        console.log("CredentialsProvider password flow");
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const identifier = String(credentials.identifier).toLowerCase().trim();
        const password = String(credentials.password);

        // const user = await prisma.user.findUnique({
        //   where: { username: credentials.username },
        // });

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username: identifier }, { email: identifier }],
          },
        });

        if (!user || !user.passwordHash) {
          console.warn(
            "CredentialsProvider: user not found or missing passwordHash",
            { identifier }
          );
          return null;
        }

        const isValidPassword = await comparePassword(
          password,
          user.passwordHash as string
        );

        if (!isValidPassword) {
          console.warn("CredentialsProvider: invalid password", {
            userId: user.id,
          });
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
    async jwt({ token, user, account, trigger, session }) {
      // console.log("JWT callback: ", { token, user, account, trigger, session });
      // Initial sign in
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

          // Persist the OAuth access_token to the token right after signin
          access_token: account.access_token,
          refresh_token: account.refresh_token ?? token.refresh_token,
          expires_at: account.expires_at ?? null,
        };
      }

      const expiresAt =
        typeof token.expires_at === "number" ? token.expires_at : null;
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
          refresh_token: newTokens.refresh_token
            ? newTokens.refresh_token
            : token.refresh_token,
        };
      } catch (error) {
        console.error("Error refreshing access_token", error);
        token.error = "RefreshTokenError";
        return token;
      }
    },
    async session({ session, token }) {
      if (token) {
        // Send properties to the client, like an access_token from a provider.
        (session as any).accessToken = (token as any).access_token;

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
