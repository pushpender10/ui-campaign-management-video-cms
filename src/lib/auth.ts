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
        },
        authorized({ auth, request: { nextUrl } }) {
          const isLoggedIn = !!auth?.user;
          const isPortalPage = nextUrl.pathname.startsWith("/portal");
          const isAnalyticsPage = nextUrl.pathname.startsWith("/analytics");
          const isCampaignsPage = nextUrl.pathname.startsWith("/campaigns");
          const isUploadPage = nextUrl.pathname.startsWith("/upload");
          const isSettingsPage = nextUrl.pathname.startsWith("/settings");

          const isProtectedPage = isPortalPage || isAnalyticsPage || isCampaignsPage || isUploadPage || isSettingsPage;
          
          if ((isProtectedPage) && !isLoggedIn) {
            return false; // Redirect unauthenticated users from protected pages
          }
          if (isLoggedIn && nextUrl.pathname === "/login") {
            return Response.redirect(new URL("/portal", nextUrl)); // Redirect authenticated users from login page
          }
          return true;
        },
      }
});


