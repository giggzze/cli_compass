'use client';

import { SignIn } from "@clerk/nextjs";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to CLI Compass
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your command line tools
          </p>
        </div>
        <div className="mt-8">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
