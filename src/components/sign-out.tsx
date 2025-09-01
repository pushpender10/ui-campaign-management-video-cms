"use client"
// app/signout/page.tsx (example)
// import { signOut } from "@/lib/auth";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
      <form action={async (formData) => {
        // "use server"; // Mark this function as a Server Action
        await signOut({ callbackUrl: "/" });
      }}>
        <Button variant={"link"} ><LogOut />Sign out</Button>
      </form>
  );
}