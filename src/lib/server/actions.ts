"use server";
import { signIn, signOut, auth } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function googleAuthenticate(callbackRedirectUrl: string) {
  // Ensure no existing session is active to avoid account linking conflicts
  const session = await auth();
  if (session?.user) {
    try {
      await signOut({ redirect: false });
    } catch (e) {
      // ignore signOut errors; proceed to signIn
    }
  }

  try {
    await signIn("google", { redirectTo: callbackRedirectUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "OAuthAccountNotLinked") {
        // If this happens, force a clean state and try once more as a pure login
        try {
          await signOut({ redirect: false });
        } catch {}
        await signIn("google", { redirectTo: callbackRedirectUrl });
        return;
      }
      return "google log in failed";
    }
    throw error;
  }
}
