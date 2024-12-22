import {
  clerkMiddleware,
  createRouteMatcher,
  getAuth,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "./db";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const path = req.nextUrl.pathname;
  console.log("path", path);

  // Public paths that don't require authentication
  const publicPaths = [
    "/_next",
    "/api",
    "/",
    "/commands",
    "/login",
    "/profile-setup"
  ];

  // Check if the current path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(publicPath + "/")
  );

  if (isPublicPath) {
    console.log("skipping middleware - public path:", path);
    return NextResponse.next();
  }

  // For all other paths, require authentication
  if (!userId) {
    console.log("redirecting to login - private path:", path);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Check if user has a profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select()
      .eq("id", userId)
      .single();
    // If no profile and not already on profile setup page, redirect to profile setup
    if (!profile && path !== "/profile-setup") {
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
