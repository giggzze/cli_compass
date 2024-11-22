import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { userProfiles } from "./db/schema";
import { eq } from "drizzle-orm";

// export const middle = clerkMiddleware();

export default clerkMiddleware(async (auth, req) => {
	const { userId} =  await auth();
  
	console.log("userId: ", userId)

	// Check if user profile exists
		const existingProfile = await db
			.select()
			

			console.log("existingProfile: ", existingProfile)
})


export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
