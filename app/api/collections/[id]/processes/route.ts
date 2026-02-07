import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { CollectionService } from "@/app/services/collectionService";

// POST /api/collections/[id]/processes - Add a process to a collection
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      const { processId, order } = await request.json();

      if (!processId) {
        return NextResponse.json(
          { success: false, error: "Process ID is required" },
          { status: 400 }
        );
      }

      await CollectionService.addProcessToCollection(params.id, processId, order);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      console.error("Error adding process to collection:", error);
      return NextResponse.json(
        { success: false, error: "Failed to add process to collection" },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/collections/[id]/processes - Remove a process from a collection
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      const { processId } = await request.json();

      if (!processId) {
        return NextResponse.json(
          { success: false, error: "Process ID is required" },
          { status: 400 }
        );
      }

      await CollectionService.removeProcessFromCollection(params.id, processId);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      console.error("Error removing process from collection:", error);
      return NextResponse.json(
        { success: false, error: "Failed to remove process from collection" },
        { status: 500 }
      );
    }
  });
}
