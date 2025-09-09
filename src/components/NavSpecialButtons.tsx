"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  return (
    <form
      action={async (formData) => {
        // "use server"; // Mark this function as a Server Action
        await signOut({ callbackUrl: "/" });
      }}
    >
      <Button variant={"link"}>
        <LogOut />
        Sign out
      </Button>
    </form>
  );
};

export const UserProfileButton = () => {
  const router = useRouter();

  return (
    <Button
      variant={"link"}
      onClick={() => router.push("/settings")}
      // className="text-gray-700 text-center hover:text-indigo-600 font-medium"
    >
      Profile
    </Button>
  );
};
