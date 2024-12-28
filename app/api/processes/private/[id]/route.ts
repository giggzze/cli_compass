import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { withAuth } from "@/lib/middleware";
import { ProcessService } from "@/app/services/processService";

// GET /api/processes/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      // Fetch process with steps
      const process = await ProcessService.getPrivateProcessesForUpdate(
        userId,
        params.id
      );

      if (process.length === 0) {
        return NextResponse.json(
          { success: false, error: "Process not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: process });
    } catch (error) {
      console.error("Error fetching process:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch process" },
        { status: 500 }
      );
    }
  });
}

// PUT /api/processes/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, steps } = body;

    // Validate input
    if (!title || !steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    await ProcessService.updateProcess(userId, params.id, title, steps);
    // Check if process exists and belongs to user

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating process:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update process" },
      { status: 500 }
    );
  }
}
