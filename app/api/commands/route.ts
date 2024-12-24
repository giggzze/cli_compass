import { NextResponse } from "next/server";
import { CommandService } from "@/app/services";

export async function GET() {
	try {
		const publicCommands = await CommandService.getPublicCommands();

		return NextResponse.json({
			success: true,
			data: publicCommands,
		});
	} catch (error) {
		console.error("Error fetching public commands:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch public commands" },
			{ status: 500 }
		);
	}
}
