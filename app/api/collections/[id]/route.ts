import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { CollectionService } from "@/app/services/collectionService";

// GET /api/collections/[id] - Get a collection with its items
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      const collection = await CollectionService.getCollectionWithItems(
        userId,
        params.id
      );

      if (!collection) {
        return NextResponse.json(
          { success: false, error: "Collection not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: collection,
      });
    } catch (error) {
      console.error("Error fetching collection:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch collection" },
        { status: 500 }
      );
    }
  });
}

// PUT /api/collections/[id] - Update a collection
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      const { name, description } = await request.json();

      const collection = await CollectionService.updateCollection(
        userId,
        params.id,
        { name, description }
      );

      if (!collection) {
        return NextResponse.json(
          { success: false, error: "Collection not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: collection,
      });
    } catch (error) {
      console.error("Error updating collection:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update collection" },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/collections/[id] - Delete a collection
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      await CollectionService.deleteCollection(userId, params.id);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      console.error("Error deleting collection:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete collection" },
        { status: 500 }
      );
    }
  });
}
