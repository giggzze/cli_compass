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
      <SignInButton mode="modal" afterSignInUrl="/private/command">
        <Button>Sign In</Button>
      </SignInButton>
    );
  }

  return (
    <>
      <Link href="/public/command">
        <Button>Commands</Button>
      </Link>
      <Link href="/public/process">
        <Button>Processes</Button>
      </Link>
    </>
  );
};

type ValidRoutes =
  | "/private/command"
  | "/private/command/add"
  | "/private/process"
  | "/private/process/add"
  | "/private/process/[id]";

const AuthenticatedNavigation = ({ pathname }: { pathname: string }) => {
  const navigationMap: Record<ValidRoutes, JSX.Element> = {
    "/private/command": (
      <>
        <Link href="/private/command/add">
          <Button>Add Command</Button>
        </Link>
        <Link href="/private/process">
          <Button>Processes</Button>
        </Link>
      </>
    ),
    "/private/command/add": (
      <>
        <Link href="/private/command">
          <Button>Commands</Button>
        </Link>
        <Link href="/private/process">
          <Button>Processes</Button>
        </Link>
      </>
    ),
    "/private/process": (
      <>
        <Link href="/private/command">
          <Button>Commands</Button>
        </Link>
        <Link href="/private/process/add">
          <Button>Create Process</Button>
        </Link>
      </>
    ),
    "/private/process/add": (
      <>
        <Link href="/private/command">
          <Button>Commands</Button>
        </Link>
        <Link href="/private/process">
          <Button>Processes</Button>
        </Link>
      </>
    ),
    "/private/process/[id]": (
      <>
        <Link href="/private/command">
          <Button>Commands</Button>
        </Link>
        <Link href="/private/process">
          <Button>Processes</Button>
        </Link>
      </>
    ),
  };

  return (
    navigationMap[pathname as ValidRoutes] || (
      <>
        <Link href="/private/command">
          <Button>Commands</Button>
        </Link>
        <Link href="/private/process">
          <Button>Processes</Button>
        </Link>
      </>
    )
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
