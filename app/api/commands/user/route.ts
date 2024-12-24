import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, commands, userCommands } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { CategoryService, CommandService } from "@/app/services";

export async function GET() {
	try {
		// check the user is authenticated
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Fetch all commands with their categories and user-specific data
		const allCommands = await CommandService.getUserCommands(userId);

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
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { name, description, category_id, is_private } =
			await request.json();

		if (!name || !description || !category_id) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Check if the category exists
		if (!CategoryService.categoryExists(category_id)) {
			return NextResponse.json(
				{ success: false, error: "Invalid category_id" },
				{ status: 400 }
			);
		}

		// Create the command in the database
		 await CommandService.createCommand(
			{
				description,
				categoryId: category_id,
				code : description, // You might want to make this a separate field in the form
				isPrivate: is_private ?? true,
			},
			userId
		);

		return NextResponse.json({
			success: true,
		});
	} catch (error) {
		console.error("Error creating command:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to create command" },
			{ status: 500 }
		);
	}
}
