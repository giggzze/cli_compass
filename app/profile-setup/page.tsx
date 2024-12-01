import { redirect } from "next/navigation";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Login from "../components/Login";

export default async function ProfileSetup() {
  const { userId } = await auth();

  if (!userId) {
    return <Login />;
  }

  // Check if user already has a profile
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, userId),
  });

  if (profile) {
    redirect("/");
  }

  // Create profile
  try {
    const response = await fetch(
      new URL("/api/profile", process.env.NEXT_PUBLIC_URL),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create profile");
    }

    const data = await response.json();
    if (data.profile) {
      redirect("/");
    }
  } catch (error) {
    throw error;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1>Setting up your profile...</h1>
          <p className="mt-2 text-gray-600">
            Please wait while we create your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
