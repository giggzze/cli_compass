"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

function PublicNavbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-gray-900">CLI Compass</h1>
        </Link>
        <div className="flex items-center gap-4">
          {pathname !== '/' && (
            <>
              <Link href="/commands">
                <Button variant="ghost">Commands</Button>
              </Link>
              <Link href="/process">
                <Button>Processes</Button>
              </Link>
            </>
          )}
          {pathname === '/' && (
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}

export default PublicNavbar;
