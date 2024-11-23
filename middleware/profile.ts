// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getAuth } from "@clerk/nextjs/server";
// import { db } from "@/db";
// import { userProfiles } from "@/db/schema";
// import { eq } from "drizzle-orm";

// export async function profileMiddleware(req: NextRequest) {
// 	try {
// 		// Get the authenticated user
// 		const { userId } = getAuth(req);

// 		if (!userId) {
// 			return NextResponse.next();
// 		}

// 		// Check if user profile exists
// 		const existingProfile = await db
// 			.select()
// 			.from(userProfiles)
// 			.where(eq(userProfiles.id, userId))
// 			.limit(1);

// 		if (existingProfile.length === 0) {
// 			// Get user data from Clerk
// 			const user = await getAuth(req);

// 			if (!user) {
// 				console.error("User data not found in Clerk");
// 				return NextResponse.next();
// 			}

// 			// Create new user profile
// 			await db.insert(userProfiles).values({
// 				id: userId,
// 				email: user.emailAddresses[0]?.emailAddress || "",
// 				username: user.username || user.firstName || "user",
// 				full_name: `${user.firstName || ""} ${
// 					user.lastName || ""
// 				}`.trim(),
// 				avatar_url: user.imageUrl,
// 				is_active: true,
// 			});
// 		}

// 		return NextResponse.next();
// 	} catch (error) {
// 		console.error("Error in profile middleware:", error);
// 		// Continue the request even if profile creation fails
// 		// We can handle this case more gracefully in the UI
// 		return NextResponse.next();
// 	}
// }
