"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Landing from "@/components/shared/Landing";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/commands/user");
    }
  }, [router, isSignedIn]);

  return <Landing />;
}
