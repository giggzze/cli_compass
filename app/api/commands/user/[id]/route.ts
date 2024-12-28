import { CommandService } from "@/app/services";
import { db } from "@/db";
import { userCommands } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    console.log("params.id", params.id);
    console.log("params.id", params);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const commandId = params.id;

    if (!commandId) {
      return NextResponse.json(
        { success: false, error: "Command ID is required" },
        { status: 400 }
      );
    }

    await CommandService.updateFavorite(userId, commandId);

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
