import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    return NextResponse.json({
      success: true,
      data: userId,
    });
  } catch (error) {
    console.error("Error getting user ID:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get user ID" },
      { status: 500 }
    );
  }
}
