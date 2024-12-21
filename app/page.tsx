"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Landing from "./components/Landing";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/commands");
    }
  }, [router, isSignedIn]);

  return <Landing />;
}
