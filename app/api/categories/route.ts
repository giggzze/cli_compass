import { NextResponse } from "next/server";
import { ICategory } from "@/app/models";
import { CategoryService } from "@/app/services";
import { ValidationError } from "@/app/services";

export async function GET() {
  try {
    // retrieve all categories from the database
    const allCategories: ICategory[] = await CategoryService.getAllCategories();

    return NextResponse.json({ success: true, data: allCategories });
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
    // parse the request body
    const body = await request.json();
    const { name } = body;

    // ensure we have a category name
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    // create a new category
    const newCategory = await CategoryService.createCategory(name);

    return NextResponse.json({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
