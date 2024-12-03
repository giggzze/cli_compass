import { NextResponse } from "next/server";
import { db } from "@/db";
import { commands, categories, userCommands } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { Tag } from "@/lib/oldTyes";

interface CommandRequest {
  name: string;
  description: string;
  category_id: string;
  tags: Tag[];
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all commands with their categories and user-specific data
    const allCommands = await db
      .select({
        id: commands.id,
        name: commands.name,
        description: commands.description,
        usage: commands.usage,
        category: {
          id: categories.id,
          name: categories.name,
        },
        created_at: commands.createdAt,
        updated_at: commands.updatedAt,
        is_favorite: userCommands.isFavorite,
        notes: userCommands.notes,
        last_used: userCommands.lastUsed,
      })
      .from(commands)
      .leftJoin(categories, eq(commands.categoryId, categories.id))
      .innerJoin(
        userCommands,
        and(
          eq(userCommands.commandId, commands.id),
          eq(userCommands.userId, userId)
        )
      )
      .orderBy(desc(commands.createdAt));

    // Format the response data to match the expected structure
    const formattedCommands = allCommands.map((cmd) => ({
      id: cmd.id,
      name: cmd.name,
      description: cmd.description,
      usage: cmd.usage,
      category: {
        id: cmd.category?.id || "uncategorized",
        name: cmd.category?.name || "Uncategorized",
      },
      isFavorite: cmd.is_favorite || false,
      notes: cmd.notes,
      lastUsed: cmd.last_used,
      created_at: cmd.created_at,
      updated_at: cmd.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: formattedCommands,
    });
  } catch (error) {
    console.error("Error fetching commands:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch commands" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, description, category_id }: CommandRequest =
      await request.json();

    if (!name || !description || !category_id) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, category_id))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid category_id" },
        { status: 400 }
      );
    }

    // Insert the command
    const newCommand = await db
      .insert(commands)
      .values({
        name,
        description,
        categoryId: category_id,
        usage: description, // You might want to make this a separate field in the form
      })
      .returning();

    // Create user-command association
    await db.insert(userCommands).values({
      userId: userId,
      commandId: newCommand[0].id,
      isFavorite: false,
    });

    return NextResponse.json({
      success: true,
      data: newCommand[0],
    });
  } catch (error) {
    console.error("Error creating command:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create command" },
      { status: 500 }
    );
  }
}
