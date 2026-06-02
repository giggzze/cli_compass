import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CommandService } from "@/app/services";
import { CommandInsert } from "@/types/STT";

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

		console.log(33)
		console.log(allCommands);
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
			const missing = [!code && "code", !description && "description", !categoryId && "categoryId"]
				.filter(Boolean)
				.join(", ");
			console.error("POST /api/commands/user — missing fields:", missing);
			return NextResponse.json(
				{ success: false, error: `Missing required fields: ${missing}` },
				{ status: 400 }
			);
		}

		const command: CommandInsert = {
			code,
			description,
			is_private: isPrivate,
			category_id: categoryId,
		}

		// Create the command in the database
		await CommandService.createCommand(command, userId);

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
