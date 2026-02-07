import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { CollectionService } from "@/app/services/collectionService";

// POST /api/collections/[id]/commands - Add a command to a collection
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      const { commandId, order } = await request.json();

      if (!commandId) {
        return NextResponse.json(
          { success: false, error: "Command ID is required" },
          { status: 400 }
        );
      }

      await CollectionService.addCommandToCollection(params.id, commandId, order);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      console.error("Error adding command to collection:", error);
      return NextResponse.json(
        { success: false, error: "Failed to add command to collection" },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/collections/[id]/commands - Remove a command from a collection
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      const { commandId } = await request.json();

      if (!commandId) {
        return NextResponse.json(
          { success: false, error: "Command ID is required" },
          { status: 400 }
        );
      }

      await CollectionService.removeCommandFromCollection(params.id, commandId);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      console.error("Error removing command from collection:", error);
      return NextResponse.json(
        { success: false, error: "Failed to remove command from collection" },
        { status: 500 }
      );
    }
  });
}
