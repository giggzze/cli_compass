import { NextResponse } from "next/server";
import { db } from "@/db";
import { commands, categories } from "@/db/schema";
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
		const body = await request.json();
		const { name, description, category_id } = body;

		if (!category_id) {
			return NextResponse.json(
				{ success: false, error: "category_id is required" },
				{ status: 400 }
			);
		}

		// Insert the command
		const [newCommand] = await db
			.insert(commands)
			.values({
				name,
				description,
				usage: name, // Using name as usage for now
				category_id,
			})
			.returning({
				id: commands.id,
				name: commands.name,
				description: commands.description,
				usage: commands.usage,
				category_id: commands.category_id,
				created_at: commands.created_at,
				updated_at: commands.updated_at,
			});

		// Fetch the complete command with category
		const [commandWithCategory] = await db
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
			.where(eq(commands.id, newCommand.id));

		return NextResponse.json({
			success: true,
			data: commandWithCategory,
		});
	} catch (error) {
		console.error("Error creating command:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to create command" },
			{ status: 500 }
		);
	}
}
