import { NextResponse, NextRequest } from "next/server";
import { UserService } from "@/app/services/userService";
import {ProfileInsert} from "@/types/STT";

export async function POST(request: NextRequest) {
  try {
    const { userId, username, userImageUrl } = await request.json();

    // Verify that the userId from the request matches the authenticated user
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create new profile
    const profile : ProfileInsert = {
      id: userId,
      username,
      avatar_url: userImageUrl,
    }
    if (await UserService.createProfile(profile)) {
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
