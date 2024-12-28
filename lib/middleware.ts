import { IApiResponse } from "@/app/models/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function withAuth<T>(
  handler: (userId: string) => Promise<NextResponse<IApiResponse<T>>>
): Promise<NextResponse<IApiResponse<T>>> {
  try {
    const { userId } = auth();

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
