import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { TagService } from "@/app/services/tagService";

// GET /api/tags - Get all tags for the authenticated user
export async function GET() {
  return withAuth(async (userId) => {
    try {
      const tags = await TagService.getUserTags(userId);

      return NextResponse.json({
        success: true,
        data: tags,
      });
    } catch (error) {
      console.error("Error fetching tags:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch tags" },
        { status: 500 }
      );
    }
  });
}

// POST /api/tags - Create a new tag
export async function POST(request: Request) {
  return withAuth(async (userId) => {
    try {
      const { name, color } = await request.json();

      if (!name) {
        return NextResponse.json(
          { success: false, error: "Tag name is required" },
          { status: 400 }
        );
      }

      const tag = await TagService.createTag(userId, { name, color });

      return NextResponse.json({
        success: true,
        data: tag,
      });
    } catch (error) {
      console.error("Error creating tag:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create tag" },
        { status: 500 }
      );
    }
  });
}
