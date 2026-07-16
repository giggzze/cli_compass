import { supabase } from "@/supabase";
import type { Tag, TagInsert, TagUpdate } from "@/types/STT";

export interface ICreateTag {
  name: string;
  color?: string;
}

export class TagService {
  /**
   * Get all tags for a user
   */
  static async getUserTags(userId: string): Promise<Tag[]> {
    const { data, error } = await supabase
      .from("tags")
      .select()
      .eq("user_id", userId);

    if (error) {
      console.error("Error in getUserTags:", error);
      throw new Error("Failed to fetch user tags");
    }
    return data ?? [];
  }

  /**
   * Create a new tag for a user
   */
  static async createTag(userId: string, data: ICreateTag): Promise<Tag> {
    const { data: newTag, error } = await supabase
      .from("tags")
      .insert({
        name: data.name,
        color: data.color ?? "#6366f1",
        user_id: userId,
      } as TagInsert)
      .select()
      .single();

    if (error) {
      console.error("Error in createTag:", error);
      throw new Error("Failed to create tag");
    }
    return newTag as Tag;
  }

  /**
   * Update a tag
   */
  static async updateTag(
    userId: string,
    tagId: string,
    data: Partial<ICreateTag>
  ): Promise<Tag | null> {
    const updatePayload: TagUpdate = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.color !== undefined) updatePayload.color = data.color;

    if (Object.keys(updatePayload).length === 0) {
      const { data: existing } = await supabase
        .from("tags")
        .select()
        .eq("id", tagId)
        .eq("user_id", userId)
        .maybeSingle();
      return existing as Tag | null;
    }

    const { data: updated, error } = await supabase
      .from("tags")
      .update(updatePayload)
      .eq("id", tagId)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error in updateTag:", error);
      throw new Error("Failed to update tag");
    }
    return updated as Tag | null;
  }

  /**
   * Delete a tag
   */
  static async deleteTag(userId: string, tagId: string): Promise<boolean> {
    const { error } = await supabase
      .from("tags")
      .delete()
      .eq("id", tagId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error in deleteTag:", error);
      throw new Error("Failed to delete tag");
    }
    return true;
  }

  /**
   * Get tags for a specific command
   */
  static async getCommandTags(commandId: string): Promise<Tag[]> {
    const { data: links, error: linksError } = await supabase
      .from("command_tags")
      .select("tag_id")
      .eq("command_id", commandId);

    if (linksError || !links?.length) return [];

    const tagIds = links.map((l) => l.tag_id);
    const { data: tags, error } = await supabase
      .from("tags")
      .select()
      .in("id", tagIds);

    if (error) {
      console.error("Error in getCommandTags:", error);
      throw new Error("Failed to fetch command tags");
    }
    return (tags ?? []) as Tag[];
  }

  /**
   * Add tags to a command
   */
  static async addTagsToCommand(
    commandId: string,
    tagIds: string[]
  ): Promise<void> {
    if (tagIds.length === 0) return;

    const rows = tagIds.map((tag_id) => ({ command_id: commandId, tag_id }));

    const { error } = await supabase.from("command_tags").insert(rows);

    if (error && error.code !== "23505") {
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
    const { error } = await supabase
      .from("command_tags")
      .delete()
      .eq("command_id", commandId)
      .eq("tag_id", tagId);

    if (error) {
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
    const { error: deleteError } = await supabase
      .from("command_tags")
      .delete()
      .eq("command_id", commandId);

    if (deleteError) {
      console.error("Error in setCommandTags (delete):", deleteError);
      throw new Error("Failed to set command tags");
    }

    if (tagIds.length > 0) {
      await this.addTagsToCommand(commandId, tagIds);
    }
  }

  /**
   * Get commands by tag
   */
  static async getCommandIdsByTag(tagId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("command_tags")
      .select("command_id")
      .eq("tag_id", tagId);

    if (error) {
      console.error("Error in getCommandIdsByTag:", error);
      throw new Error("Failed to fetch commands by tag");
    }
    return (data ?? []).map((r) => r.command_id);
  }
}
