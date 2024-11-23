import { NextResponse } from "next/server";
import { db } from "@/db";
import { commands, categories, commandTags } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
	try {
		// Fetch all commands with their categories
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
				created_at: commands.created_at,
				updated_at: commands.updated_at,
			})
			.from(commands)
			.leftJoin(categories, eq(commands.category_id, categories.id))
			.orderBy(desc(commands.created_at));

		return NextResponse.json({
			success: true,
			data: allCommands,
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
		const { name, description, category_id, tags } = await request.json();

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
		const newCommand = await db.insert(commands).values({
			name,
			description,
			category_id,
			usage: description, // You might want to make this a separate field in the form
		}).returning();

		// Insert command tags
		if (tags && tags.length > 0) {
			const commandTags = tags.map(tagName => ({
				command_id: newCommand[0].id,
				tag_id: tagName.toLowerCase().replace(/\s+/g, '-'),
			}));

			await db.insert(commandTags).values(commandTags);
		}

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
