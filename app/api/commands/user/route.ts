import { NextResponse } from "next/server";
import { db } from "@/db";
import { userCommands } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { command_id, is_favorite, notes } = await request.json();

		if (!command_id) {
			return NextResponse.json(
				{ success: false, error: "Command ID is required" },
				{ status: 400 }
			);
		}

		// Check if user-command association exists
		const existingAssociation = await db
			.select()
			.from(userCommands)
			.where(
				and(
					eq(userCommands.user_id, userId),
					eq(userCommands.command_id, command_id)
				)
			)
			.limit(1);

		if (existingAssociation.length === 0) {
			// Create new association
			await db.insert(userCommands).values({
				user_id: userId,
				command_id,
				is_favorite: is_favorite ?? false,
				notes: notes ?? null,
				last_used: new Date(),
			});
		} else {
			// Update existing association
			await db
				.update(userCommands)
				.set({
					is_favorite: is_favorite ?? existingAssociation[0].is_favorite,
					notes: notes ?? existingAssociation[0].notes,
					last_used: new Date(),
				})
				.where(
					and(
						eq(userCommands.user_id, userId),
						eq(userCommands.command_id, command_id)
					)
				);
		}

		return NextResponse.json({
			success: true,
		});
	} catch (error) {
		console.error("Error updating user command:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to update user command" },
			{ status: 500 }
		);
	}
}
