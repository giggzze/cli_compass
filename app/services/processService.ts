import { db } from "@/db";
import { processes, processSteps, profiles } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { IGetProcessWithStep, IProcess, IProcessStep } from "../models/Process";

export class ProcessService {
  private static groupProcessSteps(allProcesses: any[]): IGetProcessWithStep[] {
    return allProcesses.reduce((acc: IGetProcessWithStep[], curr) => {
      const existingProcess = acc.find((p) => p.id === curr.id);
      if (!existingProcess) {
        acc.push({
          id: curr.id,
          userId: curr.userId,
          title: curr.title,
          isPrivate: curr.isPrivate,
          createdAt: curr.createdAt,
          steps: curr.steps ? [curr.steps] : [],
          user: curr.user,
        });
      } else if (curr.steps) {
        existingProcess.steps.push(curr.steps);
      }
      return acc;
    }, []);
  }

  static async getPublicProcesses(): Promise<IGetProcessWithStep[]> {
    const allProcesses = await db
      .select({
        id: processes.id,
        title: processes.title,
        userId: processes.userId,
        isPrivate: processes.isPrivate,
        createdAt: processes.createdAt,
        steps: processSteps,
        user: profiles,
      })
      .from(processes)
      .leftJoin(profiles, eq(processes.userId, profiles.id))
      .leftJoin(processSteps, eq(processes.id, processSteps.processId))
      .where(eq(processes.isPrivate, false))
      .orderBy(desc(processes.createdAt));

    return this.groupProcessSteps(allProcesses);
  }

  static async getPrivateProcesses(userId: string) {
    const allProcesses = await db
      .select({
        id: processes.id,
        title: processes.title,
        userId: processes.userId,
        isPrivate: processes.isPrivate,
        createdAt: processes.createdAt,
        steps: processSteps,
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

    return this.groupProcessSteps(allProcesses);
  }

  static async getPrivateProcessesForUpdate(userId: string, processId: string) {
    const allProcesses = await db
      .select({
        id: processes.id,
        title: processes.title,
        userId: processes.userId,
        isPrivate: processes.isPrivate,
        createdAt: processes.createdAt,
        steps: processSteps,
      })
      .from(processes)
      .leftJoin(processSteps, eq(processes.id, processSteps.processId))
      .where(and(eq(processes.id, processId), eq(processes.userId, userId)))
      .orderBy(desc(processes.createdAt));

    return this.groupProcessSteps(allProcesses);
  }

  static async createProcess(
    userId: string,
    title: string,
    steps: IProcessStep[],
    isPrivate = true
  ): Promise<void> {
    const [newProcess] = await db
      .insert(processes)
      .values({
        userId: userId,
        title: title,
        isPrivate: isPrivate,
      })
      .returning();

    const stepsToInsert = steps.map((step: IProcessStep, index: number) => ({
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
