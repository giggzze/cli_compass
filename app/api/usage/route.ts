import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { UsageService } from "@/app/services/usageService";

// GET /api/usage - Get usage statistics for the authenticated user
export async function GET() {
  return withAuth(async (userId) => {
    try {
      const stats = await UsageService.getUserStats(userId);

      return NextResponse.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error fetching usage stats:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch usage statistics" },
        { status: 500 }
      );
    }
  });
}

// POST /api/usage - Track a command usage
export async function POST(request: Request) {
  return withAuth(async (userId) => {
    try {
      const { commandId, action } = await request.json();

      if (!commandId || !action) {
        return NextResponse.json(
          { success: false, error: "commandId and action are required" },
          { status: 400 }
        );
      }

      if (action !== "copy" && action !== "view") {
        return NextResponse.json(
          { success: false, error: "action must be 'copy' or 'view'" },
          { status: 400 }
        );
      }

      await UsageService.trackUsage(userId, commandId, action);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      console.error("Error tracking usage:", error);
      return NextResponse.json(
        { success: false, error: "Failed to track usage" },
        { status: 500 }
      );
    }
  });
}
