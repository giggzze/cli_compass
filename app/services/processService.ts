import { db } from "@/db";
import { processes, processSteps, profiles } from "@/db/schema";
import { ProcessStep } from "@/lib/db.types";
import { desc, eq } from "drizzle-orm";

export class ProcessService {
  static async getProcesses(userId: string) {
    return await db
      .select({
        id: processes.id,
        title: processes.title,
        userId: processes.userId,
        steps: processSteps,
        createdAt: processes.createdAt,
        user: {
          id: profiles.id,
          username: profiles.username,
          avatarUrl: profiles.avatarUrl,
        },
      })
      .from(processes)
      .leftJoin(profiles, eq(processes.userId, profiles.id))
      .leftJoin(processSteps, eq(processes.id, processSteps.processId))
      .where(eq(processes.userId, userId))
      .orderBy(desc(processes.createdAt));
  }

  static async createProcess(
    userId: string,
    title: string,
    steps: ProcessStep[]
  ): Promise<void> {
    const [newProcess] = await db
      .insert(processes)
      .values({
        userId: userId,
        title: title,
      })
      .returning();

    const stepsToInsert = steps.map((step: ProcessStep, index: number) => ({
      processId: newProcess.id,
      stepExplanation: step.stepExplanation,
      code: step.code || null,
      order: index,
    }));

    await db.insert(processSteps).values(stepsToInsert);
  }
}

// await db
// .select({
//   id: processes.id,
//   title: processes.title,
//   steps: processSteps,
// })
// .from(processes)
// .leftJoin(processSteps, eq(processes.id, processSteps.processId))
// .where(eq(processes.userId, userId))
// // .orderBy(desc(processes.created_at));
