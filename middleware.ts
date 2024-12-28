import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UserService } from "./app/services/userService";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  async afterAuth(auth, req, evt) {
    const { userId } = auth;
    const path = req.nextUrl.pathname;
    console.log("path", path);

    // Paths that require authentication
    const privatePaths = [
      "/private/command",
      "/private/command/add",
      "/private/process",
      "/private/process/add",
      "/private/process/[id]",
      "private/profile-setup",
    ];

    // Check if the current path is private
    const isPrivatePath = privatePaths.some(
      (privatePath) =>
        path === privatePath || path.startsWith(privatePath + "/")
    );

    // If it's not a private path, allow access
    if (!isPrivatePath) {
      console.log("skipping middleware - public path:", path);
      return NextResponse.next();
    }

    // For private paths, require authentication
    if (!userId) {
      console.log("redirecting to login - private path:", path);
      return NextResponse.redirect(new URL("/public/login", req.url));
    }

    // Special handling for profile-setup path
    if (path === "/private/profile-setup") {
      const userExists = await UserService.userExists(userId);
      if (userExists) {
        // If user has a profile, redirect them away from profile setup
        return NextResponse.redirect(new URL("/", req.url));
      }
      // If no profile, allow them to continue to profile setup
      return NextResponse.next();
    }

    // For all private paths, check if user has a profile
    const userExists = await UserService.userExists(userId);
    if (!userExists) {
      // If no profile, redirect to profile setup
      return NextResponse.redirect(new URL("/private/profile-setup", req.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
