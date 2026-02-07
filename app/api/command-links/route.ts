import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { CommandLinkService } from "@/app/services/commandLinkService";

// GET /api/command-links?commandId=xxx - Get related commands
export async function GET(request: Request) {
  return withAuth(async () => {
    try {
      const { searchParams } = new URL(request.url);
      const commandId = searchParams.get("commandId");

      if (!commandId) {
        return NextResponse.json(
          { success: false, error: "Command ID is required" },
          { status: 400 }
        );
      }

      const relatedCommands = await CommandLinkService.getRelatedCommands(
        commandId
      );

      return NextResponse.json({
        success: true,
        data: relatedCommands,
      });
    } catch (error) {
      console.error("Error fetching related commands:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch related commands" },
        { status: 500 }
      );
    }
  });
}

// POST /api/command-links - Create a link between commands
export async function POST(request: Request) {
  return withAuth(async () => {
    try {
      const { commandId, relatedCommandId, relationshipType } =
        await request.json();

      if (!commandId || !relatedCommandId) {
        return NextResponse.json(
          {
            success: false,
            error: "Both commandId and relatedCommandId are required",
          },
          { status: 400 }
        );
      }

      const link = await CommandLinkService.createLink(
        commandId,
        relatedCommandId,
        relationshipType
      );

      return NextResponse.json({
        success: true,
        data: link,
      });
    } catch (error) {
      console.error("Error creating command link:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create command link" },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/command-links - Remove a link between commands
export async function DELETE(request: Request) {
  return withAuth(async () => {
    try {
      const { commandId, relatedCommandId } = await request.json();

      if (!commandId || !relatedCommandId) {
        return NextResponse.json(
          {
            success: false,
            error: "Both commandId and relatedCommandId are required",
          },
          { status: 400 }
        );
      }

      await CommandLinkService.removeLink(commandId, relatedCommandId);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      console.error("Error removing command link:", error);
      return NextResponse.json(
        { success: false, error: "Failed to remove command link" },
        { status: 500 }
      );
    }
  });
}
