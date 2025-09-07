import NextAuth from "next-auth";
import { authOptions } from "./server/next-auth-config";

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
