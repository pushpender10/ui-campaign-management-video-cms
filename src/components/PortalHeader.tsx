"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// import { auth } from "@/lib/auth";
import { useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { navigationItems } from "@/lib/shared/nav-links";
import { SignOutButton, UserProfileButton } from "./NavSpecialButtons";

export default function PortalHeader() {
  const [isOpen, setIsOpen] = useState(false);

  // const session = await auth();
  const { data: session, update, status } = useSession();
  // console.log(session?.user);
  // console.log("update fn:", update);
  // console.log("Session status:", status);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link href="/" className="text-2xl font-extrabold text-indigo-600">
            VideoCMS
          </Link>
        </div>

        {/* Desktop Nav */}
        {status === "authenticated" && (
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((link) => (
              <Link
                key={link.title}
                href={link.url}
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        )}
        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-3">
          {session?.user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center justify-center gap-2 cursor-pointer">
                    <div className="size-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex-1 justify-start items-start min-w-0 truncate">
                        <p className="font-semibold text-gray-950 text-sm truncate">
                          {session?.user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">Admin</p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Admin</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* 
                  {navLinks.map((link) => (
                    <DropdownMenuItem key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-700 text-center hover:text-indigo-600 font-medium"
                      >
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))} 
                   */}
                  <DropdownMenuItem>
                    <UserProfileButton />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SignOutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button>Sign In</Button>
              </Link>
              {/* <Button>Sign Up</Button> */}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="p-2 text-gray-700 hover:text-indigo-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <nav className="flex flex-col px-6 py-4 space-y-3">
            {session?.user ? (
              <>
                {navigationItems.map((link) => (
                  <Link
                    key={link.title}
                    href={link.url}
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    {link.title}
                  </Link>
                ))}
                <UserProfileButton />
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button>Sign In</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
