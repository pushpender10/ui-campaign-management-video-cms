import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
import Google from "next-auth/providers/google"
import { prisma } from "./database";
import { comparePassword } from "@/lib/shared/password";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValidPassword = await comparePassword(credentials.password, user.passwordHash as string);
        
        if (!isValidPassword) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: (user as any).username,
        };
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  secret: process.env.AUTH_SECRET
};
