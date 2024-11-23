import { UserProfile } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function ProfileSetup() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already has a profile
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, userId),
  });

  if (profile) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none p-0",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
