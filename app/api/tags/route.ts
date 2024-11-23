import { NextResponse } from "next/server";
import { db } from "@/db";
import { tags } from "@/db/schema";

export async function GET() {
  try {
    const allTags = await db.select().from(tags);
    return NextResponse.json({
      success: true,
      data: allTags,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Tag name is required" },
        { status: 400 }
      );
    }

    const newTag = await db
      .insert(tags)
      .values({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newTag[0],
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
