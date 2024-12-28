import { test, expect } from "@playwright/test";
import { ProcessService } from "@/app/services/processService";
import { db } from "@/db";
import { processes, processSteps, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

test.describe("ProcessService", () => {
  let testUserId: string;
  let testProcessId: string;

  test.beforeAll(async () => {
    // Setup test data
    const testProfile = await db
      .insert(profiles)
      .values({
        username: "testuser",
        avatarUrl: "",
      })
      .returning();
    testUserId = testProfile[0].id;

    // Create a test process
    const testProcess = await db
      .insert(processes)
      .values({
        title: "Test Process",
        userId: testUserId,
        createdAt: new Date().toISOString(),
      })
      .returning();
    testProcessId = testProcess[0].id;

    // Create test steps
    await db.insert(processSteps).values([
      {
        processId: testProcessId,
        stepExplanation: "Test Step 1",
        code: "console.log('step 1')",
        order: 0,
      },
      {
        processId: testProcessId,
        stepExplanation: "Test Step 2",
        code: null,
        order: 1,
      },
    ]);
  });

  test.afterAll(async () => {
    // Cleanup test data
    await db
      .delete(processSteps)
      .where(eq(processSteps.processId, testProcessId));
    await db.delete(processes).where(eq(processes.id, testProcessId));
    await db.delete(profiles).where(eq(profiles.id, testUserId));
  });

  test("getProcesses should return user's processes with steps", async () => {
    const processes = await ProcessService.getPrivateProcesses(testUserId);

    expect(processes).toBeDefined();
    expect(processes.length).toBeGreaterThan(0);

    const testProcess = processes.find((p) => p.id === testProcessId);
    expect(testProcess).toBeDefined();
    expect(testProcess?.title).toBe("Test Process");
    expect(testProcess?.userId).toBe(testUserId);
    expect(testProcess?.steps).toHaveLength(2);

    // Verify steps are in correct order
    const steps = testProcess?.steps || [];
    expect(steps[0].stepExplanation).toBe("Test Step 1");
    expect(steps[0].code).toBe("console.log('step 1')");
    expect(steps[1].stepExplanation).toBe("Test Step 2");
    expect(steps[1].code).toBeNull();
  });

  test("createProcess should create process with steps", async () => {
    const newProcessTitle = "New Test Process";
    const newSteps = [
      {
        stepExplanation: "New Step 1",
        code: "console.log('new step 1')",
      },
      {
        stepExplanation: "New Step 2",
        code: null,
      },
    ];

    await ProcessService.createProcess(
      testUserId,
      newProcessTitle,
      newSteps,
      true
    );

    // Verify process was created
    const createdProcess = await db
      .select()
      .from(processes)
      .where(eq(processes.title, newProcessTitle))
      .limit(1);

    expect(createdProcess).toHaveLength(1);
    expect(createdProcess[0].userId).toBe(testUserId);

    // Verify steps were created
    const createdSteps = await db
      .select()
      .from(processSteps)
      .where(eq(processSteps.processId, createdProcess[0].id));

    expect(createdSteps).toHaveLength(2);
    expect(createdSteps[0].stepExplanation).toBe("New Step 1");
    expect(createdSteps[0].code).toBe("console.log('new step 1')");
    expect(createdSteps[0].order).toBe(0);
    expect(createdSteps[1].stepExplanation).toBe("New Step 2");
    expect(createdSteps[1].code).toBeNull();
    expect(createdSteps[1].order).toBe(1);

    // Cleanup the created test process
    await db
      .delete(processSteps)
      .where(eq(processSteps.processId, createdProcess[0].id));
    await db.delete(processes).where(eq(processes.id, createdProcess[0].id));
  });
});
