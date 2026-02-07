import { db } from "@/db";
import { tags, commandTags } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export interface ITag {
  id: string;
  name: string;
  color: string | null;
  userId: string;
  createdAt: string | null;
}

export interface ICreateTag {
  name: string;
  color?: string;
}

export class TagService {
  /**
   * Get all tags for a user
   */
  static async getUserTags(userId: string): Promise<ITag[]> {
    try {
      return await db
        .select()
        .from(tags)
        .where(eq(tags.userId, userId));
    } catch (error) {
      console.error("Error in getUserTags:", error);
      throw new Error("Failed to fetch user tags");
    }
  }

  /**
   * Create a new tag for a user
   */
  static async createTag(userId: string, data: ICreateTag): Promise<ITag> {
    try {
      const [newTag] = await db
        .insert(tags)
        .values({
          name: data.name,
          color: data.color || "#6366f1",
          userId,
        })
        .returning();

      return newTag;
    } catch (error) {
      console.error("Error in createTag:", error);
      throw new Error("Failed to create tag");
    }
  }

  /**
   * Update a tag
   */
  static async updateTag(
    userId: string,
    tagId: string,
    data: Partial<ICreateTag>
  ): Promise<ITag | null> {
    try {
      const [updatedTag] = await db
        .update(tags)
        .set({
          ...(data.name && { name: data.name }),
          ...(data.color && { color: data.color }),
        })
        .where(and(eq(tags.id, tagId), eq(tags.userId, userId)))
        .returning();

      return updatedTag || null;
    } catch (error) {
      console.error("Error in updateTag:", error);
      throw new Error("Failed to update tag");
    }
  }

  /**
   * Delete a tag
   */
  static async deleteTag(userId: string, tagId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(tags)
        .where(and(eq(tags.id, tagId), eq(tags.userId, userId)));

      return true;
    } catch (error) {
      console.error("Error in deleteTag:", error);
      throw new Error("Failed to delete tag");
    }
  }

  /**
   * Get tags for a specific command
   */
  static async getCommandTags(commandId: string): Promise<ITag[]> {
    try {
      const result = await db
        .select({
          id: tags.id,
          name: tags.name,
          color: tags.color,
          userId: tags.userId,
          createdAt: tags.createdAt,
        })
        .from(commandTags)
        .innerJoin(tags, eq(commandTags.tagId, tags.id))
        .where(eq(commandTags.commandId, commandId));

      return result;
    } catch (error) {
      console.error("Error in getCommandTags:", error);
      throw new Error("Failed to fetch command tags");
    }
  }

  /**
   * Add tags to a command
   */
  static async addTagsToCommand(
    commandId: string,
    tagIds: string[]
  ): Promise<void> {
    try {
      if (tagIds.length === 0) return;

      const values = tagIds.map((tagId) => ({
        commandId,
        tagId,
      }));

      await db.insert(commandTags).values(values).onConflictDoNothing();
    } catch (error) {
      console.error("Error in addTagsToCommand:", error);
      throw new Error("Failed to add tags to command");
    }
  }

  /**
   * Remove a tag from a command
   */
  static async removeTagFromCommand(
    commandId: string,
    tagId: string
  ): Promise<void> {
    try {
      await db
        .delete(commandTags)
        .where(
          and(
            eq(commandTags.commandId, commandId),
            eq(commandTags.tagId, tagId)
          )
        );
    } catch (error) {
      console.error("Error in removeTagFromCommand:", error);
      throw new Error("Failed to remove tag from command");
    }
  }

  /**
   * Set tags for a command (replaces existing tags)
   */
  static async setCommandTags(
    commandId: string,
    tagIds: string[]
  ): Promise<void> {
    try {
      // Delete existing tags
      await db
        .delete(commandTags)
        .where(eq(commandTags.commandId, commandId));

      // Add new tags
      if (tagIds.length > 0) {
        await this.addTagsToCommand(commandId, tagIds);
      }
    } catch (error) {
      console.error("Error in setCommandTags:", error);
      throw new Error("Failed to set command tags");
    }
  }

  /**
   * Get commands by tag
   */
  static async getCommandIdsByTag(tagId: string): Promise<string[]> {
    try {
      const result = await db
        .select({ commandId: commandTags.commandId })
        .from(commandTags)
        .where(eq(commandTags.tagId, tagId));

      return result.map((r) => r.commandId);
    } catch (error) {
      console.error("Error in getCommandIdsByTag:", error);
      throw new Error("Failed to fetch commands by tag");
    }
  }
}
