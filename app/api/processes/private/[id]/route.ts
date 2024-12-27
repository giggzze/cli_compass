import { NextResponse } from "next/server";
import { db } from "@/db";
import { processes, processSteps } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { withAuth } from "@/lib/middleware";
import { ProcessService } from "@/app/services/processService";

// GET /api/processes/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (userId) => {
    try {
      // Fetch process with steps
      const process = await ProcessService.getPrivateProcessesForUpdate(
        userId,
        params.id
      );

      // const process = await db
      //   .select({
      //     id: processes.id,
      //     title: processes.title,
      //     isPrivate: processes.isPrivate,
      //     createdAt: processes.createdAt,
      //     steps: processSteps,
      //     user: {
      //       id: users.id,
      //       username: users.username,
      //       avatarUrl: users.avatarUrl,
      //     },
      //   })
      //   .from(processes)
      //   .leftJoin(processSteps, eq(processes.id, processSteps.processId))
      //   .leftJoin(users, eq(processes.userId, users.id))
      //   .where(and(eq(processes.id, params.id), eq(processes.userId, userId)))
      //   .orderBy(desc(processSteps.order));

      if (process.length === 0) {
        return NextResponse.json(
          { success: false, error: "Process not found" },
          { status: 404 }
        );
      }

      // Format the response
      // const formattedProcess = {
      //   id: process[0].id,
      //   title: process[0].title,
      //   isPrivate: process[0].isPrivate,
      //   createdAt: process[0].createdAt,
      //   user: process[0].user,
      //   steps: process
      //     .filter((p) => p.steps !== null)
      //     .map((p) => p.steps!)
      //     .filter((step): step is NonNullable<typeof step> => step !== null)
      //     .sort((a, b) => a.order - b.order),
      // };

      return NextResponse.json({ success: true, data: process });
    } catch (error) {
      console.error("Error fetching process:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch process" },
        { status: 500 }
      );
    }
  });
}

// PUT /api/processes/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, steps } = body;

    // Validate input
    if (!title || !steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    // Check if process exists and belongs to user
    const existingProcess = await db
      .select()
      .from(processes)
      .where(eq(processes.id, params.id))
      .limit(1);

    if (existingProcess.length === 0) {
      return NextResponse.json(
        { success: false, error: "Process not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existingProcess[0].userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update process and steps in a transaction
    const updatedProcess = await db.transaction(async (tx) => {
      // Delete existing steps
      await tx
        .delete(processSteps)
        .where(eq(processSteps.processId, params.id));

      // Update process title
      await tx
        .update(processes)
        .set({ title })
        .where(eq(processes.id, params.id));

      // Insert new steps
      await tx
        .insert(processSteps)
        .values(
          steps.map((step: ProcessStep, index: number) => ({
            processId: params.id,
            title: step.title,
            stepExplanation: step.stepExplanation,
            code_block: step.code_block || null,
            order: index,
          }))
        )
        .returning();

      // Fetch updated process with steps
      const updatedProcess = await tx
        .select({
          id: processes.id,
          title: processes.title,
          steps: processSteps,
        })
        .from(processes)
        .leftJoin(processSteps, eq(processes.id, processSteps.processId))
        .where(eq(processes.id, params.id))
        .orderBy(desc(processSteps.order));

      return {
        id: updatedProcess[0].id,
        title: updatedProcess[0].title,
        steps: updatedProcess
          .filter((p) => p.steps !== null)
          .map((p) => p.steps!)
          .filter((step): step is NonNullable<typeof step> => step !== null)
          .sort((a, b) => a.order - b.order),
      };
    });

    return NextResponse.json({ success: true, data: updatedProcess });
  } catch (error) {
    console.error("Error updating process:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update process" },
      { status: 500 }
    );
  }
}
