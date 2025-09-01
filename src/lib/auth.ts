import NextAuth from "next-auth"
import { authOptions } from "./server/next-auth-config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authOptions,
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            (token as any).username = (user as any).username;
          }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            session.user.id = token.id as string;
            (session.user as any).username = (token as any).username as string;
          }
          return session;
        }
      }
});


