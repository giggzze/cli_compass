"use client";

import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { CliLogo } from "@/components/icons/CliLogo";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <CliLogo className="w-8 h-8" />
    <h1 className="text-2xl font-bold text-gray-900">CLI Compass</h1>
  </Link>
);

const PublicNavigation = ({ pathname }: { pathname: string }) => {
  if (pathname === "/") {
    return (
      <SignInButton mode="modal">
        <Button>Sign In</Button>
      </SignInButton>
    );
  }

  return (
    <>
      <Link href="/commands">
        <Button>Commands</Button>
      </Link>
      <Link href="/process">
        <Button>Processes</Button>
      </Link>
    </>
  );
};

type ValidRoutes = "/commands/user" | "/commands/add" | "/process" | "/process/add" | "/process/[id]";

const AuthenticatedNavigation = ({ pathname }: { pathname: string }) => {
  const navigationMap: Record<ValidRoutes, JSX.Element> = {
    "/commands/user": (
      <>
        <Link href="/commands/add">
          <Button>Add Command</Button>
        </Link>
        <Link href="/process">
          <Button>Processes</Button>
        </Link>
      </>
    ),
    "/commands/add": (
      <>
        <Link href="/commands/user">
          <Button>Commands</Button>
        </Link>
        <Link href="/process">
          <Button>Processes</Button>
        </Link>
      </>
    ),
    "/process": (
      <>
        <Link href="/commands/user">
          <Button>Commands</Button>
        </Link>
        <Link href="/process/add">
          <Button>Create Process</Button>
        </Link>
      </>
    ),
    "/process/add": (
      <>
        <Link href="/commands/user">
          <Button>Commands</Button>
        </Link>
        <Link href="/process">
          <Button>Processes</Button>
        </Link>
      </>
    ),
    "/process/[id]": (
      <>
        <Link href="/commands/user">
          <Button>Commands</Button>
        </Link>
        <Link href="/process">
          <Button>Processes</Button>
        </Link>
      </>
    ),
  };

  return navigationMap[pathname as ValidRoutes] || (
    <>
      <Link href="/commands/user">
        <Button>Commands</Button>
      </Link>
      <Link href="/process">
        <Button>Processes</Button>
      </Link>
    </>
  );
};

function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <AuthenticatedNavigation pathname={pathname} />
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <PublicNavigation pathname={pathname} />
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
