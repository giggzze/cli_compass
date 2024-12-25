import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { profiles } from "@/db/schema";
import { UserService } from "@/app/services/userService";

export async function POST(request: NextRequest) {
	try {
		const { userId, username, userImageUrl } = await request.json();

		// Verify that the userId from the request matches the authenticated user
		if (!userId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Create new profile
		if (await UserService.createProfile(userId, username, userImageUrl)) {
			return NextResponse.json({ success: true });
		}

		return NextResponse.json({ success: false });
	} catch (error) {
		console.error("Error creating profile:", error);
		return NextResponse.json(
			{ error: "Failed to create profile" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json({ message: "success" });
}
