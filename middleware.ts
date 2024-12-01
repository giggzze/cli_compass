import { clerkMiddleware, createRouteMatcher, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "./db";


export default clerkMiddleware(async (auth, req) => {
	const { userId } = await auth();
	const path = req.nextUrl.pathname;

	// console.log("userId", userId);
	// Skip middleware for public paths and API routes
	if (
		path.startsWith("/_next") ||
		path.startsWith("/api") ||
		path === "/profile-setup"
	) {
		return NextResponse.next();
	}

	if (!userId) {
		return NextResponse.next();
	}

	try {
		//   // Check if user has a profile
		const { data: profile } = await supabase
			.from("user_profiles")
			.select()
			.eq("id", userId)
			.single();
		// If no profile and not already on profile setup page, redirect to profile setup
		if (!profile && path !== "/profile-setup") {
			// return NextResponse.next();
			return NextResponse.redirect(new URL("/profile-setup", req.url));
		}

		return NextResponse.next();
	} catch (error) {
		console.error("Error in middleware:", error);
		return NextResponse.next();
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
