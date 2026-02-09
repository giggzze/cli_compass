import { supabase } from "@/supabase";
import type {
  Collection,
  CollectionInsert,
  CollectionWithItems,
} from "@/types/STT";

export interface ICreateCollection {
  name: string;
  description?: string;
}

export class CollectionService {
  /**
   * Get all collections for a user
   */
  static async getUserCollections(userId: string): Promise<Collection[]> {
    const { data, error } = await supabase
      .from("collections")
      .select()
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error in getUserCollections:", error);
      throw new Error("Failed to fetch user collections");
    }
    return data ?? [];
  }

  /**
   * Get a collection with its items
   */
  static async getCollectionWithItems(
    userId: string,
    collectionId: string
  ): Promise<CollectionWithItems | null> {
    const { data: collection, error: collError } = await supabase
      .from("collections")
      .select()
      .eq("id", collectionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (collError || !collection) return null;

    const { data: collectionCmds, error: cmdsError } = await supabase
      .from("collection_commands")
      .select(
        "id, order, commands(id, description, code, is_private, category_id, created_at, categories(id, name))"
      )
      .eq("collection_id", collectionId)
      .order("order", { ascending: true });

    if (cmdsError) {
      console.error("Error in getCollectionWithItems (commands):", cmdsError);
      throw new Error("Failed to fetch collection with items");
    }

    const { data: collectionProcs, error: procsError } = await supabase
      .from("collection_processes")
      .select("id, order, processes(id, title, user_id, is_private, created_at)")
      .eq("collection_id", collectionId)
      .order("order", { ascending: true });

    if (procsError) {
      console.error("Error in getCollectionWithItems (processes):", procsError);
      throw new Error("Failed to fetch collection with items");
    }

    type CmdRow = { order: number | null; commands: Record<string, unknown> | null };
    type ProcRow = { order: number | null; processes: Record<string, unknown> | null };

    const commands = (collectionCmds ?? []).map((cc: CmdRow) => ({
      ...(cc.commands ?? {}),
      order: cc.order,
    }));

    const processes = (collectionProcs ?? []).map((cp: ProcRow) => ({
      ...(cp.processes ?? {}),
      order: cp.order,
    }));

    return {
      ...collection,
      commands,
      processes,
    } as CollectionWithItems;
  }

  /**
   * Create a new collection
   */
  static async createCollection(
    userId: string,
    data: ICreateCollection
  ): Promise<Collection> {
    const { data: newCollection, error } = await supabase
      .from("collections")
      .insert({
        name: data.name,
        description: data.description ?? null,
        user_id: userId,
      } as CollectionInsert)
      .select()
      .single();

    if (error) {
      console.error("Error in createCollection:", error);
      throw new Error("Failed to create collection");
    }
    return newCollection;
  }

  /**
   * Update a collection
   */
  static async updateCollection(
    userId: string,
    collectionId: string,
    data: Partial<ICreateCollection>
  ): Promise<Collection | null> {
    const updatePayload: Record<string, unknown> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.description !== undefined) updatePayload.description = data.description;

    if (Object.keys(updatePayload).length === 0) {
      const { data: existing } = await supabase
        .from("collections")
        .select()
        .eq("id", collectionId)
        .eq("user_id", userId)
        .maybeSingle();
      return existing;
    }

    const { data: updated, error } = await supabase
      .from("collections")
      .update(updatePayload)
      .eq("id", collectionId)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error in updateCollection:", error);
      throw new Error("Failed to update collection");
    }
    return updated;
  }

  /**
   * Delete a collection
   */
  static async deleteCollection(
    userId: string,
    collectionId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error in deleteCollection:", error);
      throw new Error("Failed to delete collection");
    }
    return true;
  }

  /**
   * Add a command to a collection
   */
  static async addCommandToCollection(
    collectionId: string,
    commandId: string,
    order?: number
  ): Promise<void> {
    const { error } = await supabase.from("collection_commands").insert({
      collection_id: collectionId,
      command_id: commandId,
      order: order ?? 0,
    });

    if (error && error.code !== "23505") {
      console.error("Error in addCommandToCollection:", error);
      throw new Error("Failed to add command to collection");
    }
  }

  /**
   * Remove a command from a collection
   */
  static async removeCommandFromCollection(
    collectionId: string,
    commandId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("collection_commands")
      .delete()
      .eq("collection_id", collectionId)
      .eq("command_id", commandId);

    if (error) {
      console.error("Error in removeCommandFromCollection:", error);
      throw new Error("Failed to remove command from collection");
    }
  }

  /**
   * Add a process to a collection
   */
  static async addProcessToCollection(
    collectionId: string,
    processId: string,
    order?: number
  ): Promise<void> {
    const { error } = await supabase.from("collection_processes").insert({
      collection_id: collectionId,
      process_id: processId,
      order: order ?? 0,
    });

    if (error && error.code !== "23505") {
      console.error("Error in addProcessToCollection:", error);
      throw new Error("Failed to add process to collection");
    }
  }

  /**
   * Remove a process from a collection
   */
  static async removeProcessFromCollection(
    collectionId: string,
    processId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("collection_processes")
      .delete()
      .eq("collection_id", collectionId)
      .eq("process_id", processId);

    if (error) {
      console.error("Error in removeProcessFromCollection:", error);
      throw new Error("Failed to remove process from collection");
    }
  }

  /**
   * Get collections containing a specific command
   */
  static async getCollectionsForCommand(
    userId: string,
    commandId: string
  ): Promise<Collection[]> {
    const { data: links, error: linksError } = await supabase
      .from("collection_commands")
      .select("collection_id")
      .eq("command_id", commandId);

    if (linksError || !links?.length) return [];

    const ids = [...new Set(links.map((l) => l.collection_id))];
    const { data: collections, error } = await supabase
      .from("collections")
      .select()
      .eq("user_id", userId)
      .in("id", ids);

    if (error) {
      console.error("Error in getCollectionsForCommand:", error);
      throw new Error("Failed to fetch collections for command");
    }
    return collections ?? [];
  }
}
