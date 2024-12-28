"use client";

import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { CliLogo } from "@/components/icons/CliLogo";
import { Menu } from "lucide-react";
import { useState } from "react";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <CliLogo className="w-8 h-8" />
    <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">CLI Compass</h1>
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Logo />
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center gap-4">
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

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="sm:hidden mt-4 space-y-2">
            {isSignedIn ? (
              <div className="flex flex-col gap-2">
                <AuthenticatedNavigation pathname={pathname} />
                <div className="flex justify-center pt-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <PublicNavigation pathname={pathname} />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
