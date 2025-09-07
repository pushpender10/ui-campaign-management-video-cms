"use client";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { googleAuthenticate } from "@/lib/server/actions";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: session, status } = useSession();
  if (status === "authenticated") {
    return redirect("/");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    console.log("Signing in with:", { identifier, password });

    try {
      const result = await signIn("credentials", {
        identifier: identifier.toLowerCase().trim(),
        password: password,
        redirect: false,
      });

      console.log("Sign-in result:", result);

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        router.push("/portal");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setError("An error occurred during login");
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* <div className="grid md:grid-cols-2 gap-6"> */}
        {/* File Upload Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white mb-5">
              <UploadIcon className="size-5" />
              <h1 className="text-2xl font-semibold">Sign in</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-100">
            <form onSubmit={onSubmit}>
              <fieldset className="flex flex-col gap-4">
                {/* <legend>User login with credentials</legend> */}
                <input
                  className="w-full border rounded px-3 py-2"
                  type="text"
                  placeholder="Email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full gradient-color text-white rounded py-2"
                >
                  Sign in
                </Button>
              </fieldset>
            </form>
          </CardContent>
          <CardFooter className="flex items-center justify-center text-gray-500">
            <div className="w-full flex flex-col py-2 gap-4">
              <Button
                className="gsi-material-button rounded"
                onClick={() => googleAuthenticate("/portal")}
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      style={{ display: "block" }}
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      ></path>
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">
                    Sign in with Google
                  </span>
                  <span style={{ display: "none" }}>Sign in with Google</span>
                </div>
              </Button>
              {/* <Button
                variant={"secondary"}
                className="w-full border rounded py-2"
                onClick={() => signIn("google", { callbackUrl: "/portal" })}
              >
                Continue with Google
              </Button> */}

              <Button
                variant={"outline"}
                className="w-full"
                onClick={() => router.push("/register")}
              >
                Create an account
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
