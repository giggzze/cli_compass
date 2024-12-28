import { CommandService } from "@/app/services";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } =  auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!params.id) {
      return NextResponse.json(
        { success: false, error: "Command ID is required" },
        { status: 400 }
      );
    }

    await CommandService.updateFavorite(userId, params.id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error updating user command:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user command" },
      { status: 500 }
    );
  }
}
