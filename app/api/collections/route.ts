import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { CollectionService } from "@/app/services/collectionService";

// GET /api/collections - Get all collections for the authenticated user
export async function GET() {
  return withAuth(async (userId) => {
    try {
      const collections = await CollectionService.getUserCollections(userId);

      return NextResponse.json({
        success: true,
        data: collections,
      });
    } catch (error) {
      console.error("Error fetching collections:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch collections" },
        { status: 500 }
      );
    }
  });
}

// POST /api/collections - Create a new collection
export async function POST(request: Request) {
  return withAuth(async (userId) => {
    try {
      const { name, description } = await request.json();

      if (!name) {
        return NextResponse.json(
          { success: false, error: "Collection name is required" },
          { status: 400 }
        );
      }

      const collection = await CollectionService.createCollection(userId, {
        name,
        description,
      });

      return NextResponse.json({
        success: true,
        data: collection,
      });
    } catch (error) {
      console.error("Error creating collection:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create collection" },
        { status: 500 }
      );
    }
  });
}
