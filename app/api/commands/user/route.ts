import { NextResponse } from "next/server";
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
		// Make sure the user is authenticated
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Parse the request body and check for required fields
		const { code, description, categoryId, isPrivate } =
			await request.json();

		if (!code || !description || !categoryId) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Create the command in the database
		await CommandService.createCommand(
			{
				description,
				categoryId,
				code,
				isPrivate,
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
