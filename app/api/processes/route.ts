import { NextResponse } from "next/server";
import { db } from "@/db";
import { processes, processSteps } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { ProcessStep, ProcessWithSteps } from "@/lib/types";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all processes with their steps
    const allProcesses = await db
      .select({
        id: processes.id,
        title: processes.title,
        created_at: processes.created_at,
        updated_at: processes.updated_at,
        steps: processSteps,
      })
      .from(processes)
      .leftJoin(processSteps, eq(processes.id, processSteps.process_id))
      .where(eq(processes.user_id, userId))
      .orderBy(desc(processes.created_at));

    // Group steps by process
    const formattedProcesses = allProcesses.reduce(
      (acc: ProcessWithSteps[], curr) => {
        const existingProcess = acc.find((p) => p.id === curr.id);
        if (!existingProcess) {
          acc.push({
            id: curr.id,
            title: curr.title,
            created_at: curr.created_at,
            updated_at: curr.updated_at,
            steps: curr.steps ? [curr.steps] : [],
            user_id: "",
          });
        } else if (curr.steps) {
          existingProcess.steps.push(curr.steps);
        }
        return acc;
      },
      []
    );

    return NextResponse.json({
      success: true,
      data: formattedProcesses,
    });
  } catch (error) {
    console.error("Error fetching processes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch processes" },
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

    const { title, steps } = await request.json();

    if (!title || !steps || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create process
    const [newProcess] = await db
      .insert(processes)
      .values({
        title,
        user_id: userId,
      })
      .returning();

    // Create steps
    const stepsToInsert = steps.map((step: ProcessStep, index: number) => ({
      process_id: newProcess.id,
      title: step.title,
      description: step.description,
      code_block: step.code_block || null,
      order: index,
    }));

    const newSteps = await db
      .insert(processSteps)
      .values(stepsToInsert)
      .returning();

    return NextResponse.json({
      success: true,
      data: {
        ...newProcess,
        steps: newSteps,
      },
    });
  } catch (error) {
    console.error("Error creating process:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create process" },
      { status: 500 }
    );
  }
}
