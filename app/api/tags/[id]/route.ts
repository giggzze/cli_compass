import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { TagService } from "@/app/services/tagService";

// PUT /api/tags/[id] - Update a tag
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      const { name, color } = await request.json();

      const tag = await TagService.updateTag(userId, params.id, { name, color });

      if (!tag) {
        return NextResponse.json(
          { success: false, error: "Tag not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: tag,
      });
    } catch (error) {
      console.error("Error updating tag:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update tag" },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/tags/[id] - Delete a tag
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      await TagService.deleteTag(userId, params.id);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      console.error("Error deleting tag:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete tag" },
        { status: 500 }
      );
    }
  });
}
