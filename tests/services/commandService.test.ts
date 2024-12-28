import { test, expect } from "@playwright/test";
import { CommandService } from "@/app/services/commandService";
import { db } from "@/db";
import { commands, categories, profiles, userCommands } from "@/db/schema";
import { eq } from "drizzle-orm";

test.describe("CommandService", () => {
  let testUserId: string;
  let testCategoryId: string;

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

    const testCategory = await db
      .insert(categories)
      .values({
        name: "Test Category",
      })
      .returning();
    testCategoryId = testCategory[0].id;
  });

  test.afterAll(async () => {
    // Cleanup only test data
    await db.delete(userCommands).where(eq(userCommands.userId, testUserId));
    await db.delete(commands).where(eq(commands.categoryId, testCategoryId));
    await db.delete(categories).where(eq(categories.id, testCategoryId));
    await db.delete(profiles).where(eq(profiles.id, testUserId));
  });

  test("getPublicCommands should return only public commands", async () => {
    // check how many public commands we have
    const publicCount = await CommandService.getPublicCommands();

    // Create test commands
    const publicCommand = await db
      .insert(commands)
      .values({
        description: "Public Command",
        code: 'echo "public"',
        isPrivate: false,
        categoryId: testCategoryId,
        createdAt: new Date().toISOString(),
      })
      .returning();

    await db.insert(commands).values({
      description: "Private Command",
      code: 'echo "private"',
      isPrivate: true,
      categoryId: testCategoryId,
      createdAt: new Date().toISOString(),
    });

    await db.insert(userCommands).values({
      userId: testUserId,
      commandId: publicCommand[0].id,
      isFavorite: false,
    });

    const publicCommands = await CommandService.getPublicCommands();

    expect(publicCommands.length).toBe(publicCount.length + 1);
    expect(publicCommands[publicCount.length].description).toBe(
      "Public Command"
    );
    expect(publicCommands[publicCount.length].isPrivate).toBe(false);
  });

  test("getUserCommands should return user-specific commands", async () => {
    const privateCommandsCount = await CommandService.getUserCommands(
      testUserId
    );

    const command = await db
      .insert(commands)
      .values({
        description: "User Command",
        code: 'echo "user"',
        isPrivate: true,
        categoryId: testCategoryId,
        createdAt: new Date().toISOString(),
      })
      .returning();

    await db.insert(userCommands).values({
      userId: testUserId,
      commandId: command[0].id,
      isFavorite: false,
    });

    const privateCommands = await CommandService.getUserCommands(testUserId);

    expect(privateCommands.length).toBeGreaterThan(0);
    expect(
      privateCommands.some((cmd) => cmd.description === "User Command")
    ).toBe(true);
    expect(privateCommands[privateCommandsCount.length].isPrivate).toBe(true);
  });

  test("createCommand should create a new command and associate it with user", async () => {
    const newCommand = {
      description: "New Command",
      code: 'echo "new"',
      isPrivate: false,
      categoryId: testCategoryId,
    };

    const result = await CommandService.createCommand(newCommand, testUserId);
    expect(result).toBe(true);

    const userCommands = await CommandService.getUserCommands(testUserId);
    expect(userCommands.some((cmd) => cmd.description === "New Command")).toBe(
      true
    );
  });

  test("checkUserAssociation should verify command ownership", async () => {
    const command = await db
      .insert(commands)
      .values({
        description: "Association Test Command",
        code: 'echo "test"',
        isPrivate: true,
        categoryId: testCategoryId,
        createdAt: new Date().toISOString(),
      })
      .returning();

    await db.insert(userCommands).values({
      userId: testUserId,
      commandId: command[0].id,
      isFavorite: false,
    });

    const hasAssociation = await CommandService.checkUserAssociation(
      testUserId,
      command[0].id
    );
    expect(hasAssociation).toBe(true);

    const noAssociation = await CommandService.checkUserAssociation(
      testUserId,
      "non-existent-id"
    );
    expect(noAssociation).toBe(false);
  });
});
