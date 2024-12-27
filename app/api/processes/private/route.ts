import { NextResponse } from "next/server";
import { db } from "@/db";
import { processes, processSteps } from "@/db/schema";
import { eq } from "drizzle-orm";
import { withAuth } from "@/lib/middleware";
import { ProcessService } from "@/app/services/processService";
import { IProcess } from "@/app/models/Process";

export async function GET() {
  return withAuth(async (userId) => {
    try {
      // Fetch all processes with their steps
      const processes: IProcess[] = await ProcessService.getPrivateProcesses(
        userId
      );

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
  });
}

export async function POST(request: Request) {
  return withAuth(async (userId) => {
    try {
      const { title, steps } = await request.json();

      if (!title || !steps || !Array.isArray(steps) || steps.length === 0) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Create process
      await ProcessService.createProcess(userId, title, steps);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      console.error("Error creating process:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create process" },
        { status: 500 }
      );
    }
  });
}
