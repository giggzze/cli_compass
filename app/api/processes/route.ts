import { NextResponse } from "next/server";
import { db } from "@/db";
import { processes, processSteps } from "@/db/schema";
import { eq } from "drizzle-orm";
import { withAuth } from "@/lib/middleware";
import { ProcessService } from "@/app/services/processService";
import { IProcess } from "@/app/models/Process";

export async function GET() {
  try {
    // Fetch all processes with their steps
    const processes: IProcess[] = await ProcessService.getPublicProcesses();

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
