import { test, expect } from "@playwright/test";
import { CommandService } from "@/app/services/commandService";
import { supabase } from "@/supabase";

test.describe("CommandService", () => {
  let testUserId: string;
  let testCategoryId: string;

  test.beforeAll(async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .insert({ username: "testuser", avatar_url: "" })
      .select("id")
      .single();
    testUserId = profile!.id;

    const { data: category } = await supabase
      .from("categories")
      .insert({ name: "Test Category" })
      .select("id")
      .single();
    testCategoryId = category!.id;
  });

  test.afterAll(async () => {
    await supabase.from("user_commands").delete().eq("user_id", testUserId);
    await supabase.from("commands").delete().eq("category_id", testCategoryId);
    await supabase.from("categories").delete().eq("id", testCategoryId);
    await supabase.from("profiles").delete().eq("id", testUserId);
  });

  test("getPublicCommands should return only public commands", async () => {
    const publicCount = await CommandService.getPublicCommands();

    const { data: publicCommand } = await supabase
      .from("commands")
      .insert({
        description: "Public Command",
        code: 'echo "public"',
        is_private: false,
        category_id: testCategoryId,
      })
      .select("id")
      .single();

    await supabase.from("commands").insert({
      description: "Private Command",
      code: 'echo "private"',
      is_private: true,
      category_id: testCategoryId,
    });

    await supabase.from("user_commands").insert({
      user_id: testUserId,
      command_id: publicCommand!.id,
      is_favorite: false,
    });

    const publicCommands = await CommandService.getPublicCommands();

    expect(publicCommands.length).toBe(publicCount.length + 1);
    expect(publicCommands[publicCount.length].description).toBe("Public Command");
    expect(publicCommands[publicCount.length].is_private).toBe(false);
  });

  test("getUserCommands should return user-specific commands", async () => {
    const privateCommandsCount = await CommandService.getUserCommands(testUserId);

    const { data: command } = await supabase
      .from("commands")
      .insert({
        description: "User Command",
        code: 'echo "user"',
        is_private: true,
        category_id: testCategoryId,
      })
      .select("id")
      .single();

    await supabase.from("user_commands").insert({
      user_id: testUserId,
      command_id: command!.id,
      is_favorite: false,
    });

    const privateCommands = await CommandService.getUserCommands(testUserId);

    expect(privateCommands.length).toBeGreaterThan(0);
    expect(privateCommands.some((cmd) => cmd.description === "User Command")).toBe(true);
    expect(privateCommands[privateCommandsCount.length].is_private).toBe(true);
  });

  test("createCommand should create a new command and associate it with user", async () => {
    const newCommand = {
      description: "New Command",
      code: 'echo "new"',
      is_private: false,
      category_id: testCategoryId,
    };

    const result = await CommandService.createCommand(newCommand, testUserId);
    expect(result).toBe(true);

    const userCommands = await CommandService.getUserCommands(testUserId);
    expect(userCommands.some((cmd) => cmd.description === "New Command")).toBe(true);
  });

  test("checkUserAssociation should verify command ownership", async () => {
    const { data: command } = await supabase
      .from("commands")
      .insert({
        description: "Association Test Command",
        code: 'echo "test"',
        is_private: true,
        category_id: testCategoryId,
      })
      .select("id")
      .single();

    await supabase.from("user_commands").insert({
      user_id: testUserId,
      command_id: command!.id,
      is_favorite: false,
    });

    const hasAssociation = await CommandService.checkUserAssociation(testUserId, command!.id);
    expect(hasAssociation).toBe(true);

    const noAssociation = await CommandService.checkUserAssociation(testUserId, "non-existent-id");
    expect(noAssociation).toBe(false);
  });
});
