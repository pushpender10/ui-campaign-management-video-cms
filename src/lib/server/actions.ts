"use server";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export async function googleAuthenticate(callbackUrl: string) {
  //   prevState: string | undefined,
  //   formData: FormData
  try {
    //signIn("google", { callbackUrl: "/portal" })
    await signIn("google", { callbackUrl: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return "google log in failed";
    }
    throw error;
  }
}
