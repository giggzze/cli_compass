"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

function Navbar() {
  const pathname = usePathname();

  const renderNavigationButton = () => {
    switch (pathname) {
      case "/commands/user":
        return (
          <>
            <Link href="/add">
              <Button>Add Command</Button>
            </Link>
            <Link href="/process">
              <Button>Processes</Button>
            </Link>
          </>
        );
      case "/add":
        return (
          <Link href="/process">
            <Button>Processes</Button>
          </Link>
        );
      case "/process":
        return (
          <>
            <Link href="/commands/user">
              <Button>Commands</Button>
            </Link>
            <Link href="/process/add">
              <Button>Create Process</Button>
            </Link>
          </>
        );
      case "/process/add":
      case "/process/[id]":
        return (
          <Link href="/commands/user">
            <Button>Commands</Button>
          </Link>
        );

      default:
        return <></>;
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-gray-900">CLI Compass</h1>
        </Link>
        <div className="flex items-center gap-4">
          {renderNavigationButton()}
          <UserButton />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
