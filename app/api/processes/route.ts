import { NextResponse } from "next/server";
import { ProcessService } from "@/app/services/processService";
import {Process} from "@/types/STT";

export async function GET() {
  try {
    // Fetch all processes with their steps
    const processes: Process[] = await ProcessService.getPublicProcesses();

    return NextResponse.json({
      success: true,
      data: processes,
    });
  } catch (error) {
    console.error("Error fetching processes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch processes" },
      { status: 500 }
    );
  }
}
