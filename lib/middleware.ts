import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ApiResponse } from "./db.types";

export async function withAuth<T>(
  handler: (userId: string) => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return await handler(userId);
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
