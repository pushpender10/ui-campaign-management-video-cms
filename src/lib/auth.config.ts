import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";

const credentialsSchema = z.object({
  identifier: z.string().min(3), // email or username
  password: z.string().min(6),
});

import { prisma } from "./prisma";

export default { providers: [Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    allowDangerousEmailAccountLinking: true,
  }),
  Credentials({
    name: "Credentials",
    credentials: {
      identifier: { label: "Email or username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (raw) => {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;
      const { identifier, password } = parsed.data;
      const user = await prisma.user.findFirst({ where: { OR: [ { email: identifier }, { username: identifier } ] } });
      if (!user?.passwordHash) return null;
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) return null;
      return { id: user.id, name: user.name ?? undefined, email: user.email ?? undefined, image: user.image ?? undefined } as {
        id: string; name?: string; email?: string; image?: string;
      };
    },
  }),] } satisfies NextAuthConfig