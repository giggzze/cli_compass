"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

function Navbar() {
  const pathname = usePathname();
  const isProcessPage = pathname?.startsWith("/process");

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-gray-900">CLI Compass</h1>
        </Link>
        <div className="flex items-center gap-4">
          {pathname === "/commands" && (
            <Link href="/add">
              <Button>Add Command</Button>
            </Link>
          )}
          {isProcessPage ? (
            <Link href="/process/add">
              <Button>Create Process</Button>
            </Link>
          ) : (
            <Link href="/process">
              <Button>Processes</Button>
            </Link>
          )}

          <UserButton />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
