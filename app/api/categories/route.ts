import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";

export async function GET() {
  try {
    const allCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories);

    return NextResponse.json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const newCategory = await db.insert(categories).values({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
    }).returning();

    return NextResponse.json({
      success: true,
      data: newCategory[0],
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
