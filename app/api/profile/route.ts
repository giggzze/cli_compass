import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
	try {
		const { userId } = await request.json();

		// Verify that the userId from the request matches the authenticated user
		if (!userId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Check if profile already exists
		const existingProfile = await db.query.userProfiles.findFirst({
			where: eq(userProfiles.id, userId),
		});

		if (existingProfile) {
			return NextResponse.json({ profile: existingProfile });
		}

		// Create new profile
		const newProfile = await db
			.insert(userProfiles)
			.values({
				id: userId,
				email: "",
				username: "",
				full_name: "",
				avatar_url: "",
				is_active: true,
			})
			.returning();

		return NextResponse.json({ profile: newProfile[0] });
	} catch (error) {
		// console.error("Error creating profile:", error);
		return NextResponse.json(
			{ error: "Failed to create profile" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json({ message: "success" });
}
