import { db } from "@/db";
import {
  collections,
  collectionCommands,
  collectionProcesses,
  commands,
  processes,
  categories,
} from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";

export interface ICollection {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string | null;
}

export interface ICreateCollection {
  name: string;
  description?: string;
}

export interface ICollectionWithItems extends ICollection {
  commands: any[];
  processes: any[];
}

export class CollectionService {
  /**
   * Get all collections for a user
   */
  static async getUserCollections(userId: string): Promise<ICollection[]> {
    try {
      return await db
        .select()
        .from(collections)
        .where(eq(collections.userId, userId))
        .orderBy(desc(collections.createdAt));
    } catch (error) {
      console.error("Error in getUserCollections:", error);
      throw new Error("Failed to fetch user collections");
    }
  }

  /**
   * Get a collection with its items
   */
  static async getCollectionWithItems(
    userId: string,
    collectionId: string
  ): Promise<ICollectionWithItems | null> {
    try {
      // Get collection
      const [collection] = await db
        .select()
        .from(collections)
        .where(
          and(eq(collections.id, collectionId), eq(collections.userId, userId))
        );

      if (!collection) return null;

      // Get commands in collection
      const collectionCmds = await db
        .select({
          id: commands.id,
          description: commands.description,
          code: commands.code,
          isPrivate: commands.isPrivate,
          categoryId: commands.categoryId,
          createdAt: commands.createdAt,
          order: collectionCommands.order,
          category: {
            id: categories.id,
            name: categories.name,
          },
        })
        .from(collectionCommands)
        .innerJoin(commands, eq(collectionCommands.commandId, commands.id))
        .leftJoin(categories, eq(commands.categoryId, categories.id))
        .where(eq(collectionCommands.collectionId, collectionId))
        .orderBy(collectionCommands.order);

      // Get processes in collection
      const collectionProcs = await db
        .select({
          id: processes.id,
          title: processes.title,
          userId: processes.userId,
          isPrivate: processes.isPrivate,
          createdAt: processes.createdAt,
          order: collectionProcesses.order,
        })
        .from(collectionProcesses)
        .innerJoin(processes, eq(collectionProcesses.processId, processes.id))
        .where(eq(collectionProcesses.collectionId, collectionId))
        .orderBy(collectionProcesses.order);

      return {
        ...collection,
        commands: collectionCmds,
        processes: collectionProcs,
      };
    } catch (error) {
      console.error("Error in getCollectionWithItems:", error);
      throw new Error("Failed to fetch collection with items");
    }
  }

  /**
   * Create a new collection
   */
  static async createCollection(
    userId: string,
    data: ICreateCollection
  ): Promise<ICollection> {
    try {
      const [newCollection] = await db
        .insert(collections)
        .values({
          name: data.name,
          description: data.description || null,
          userId,
        })
        .returning();

      return newCollection;
    } catch (error) {
      console.error("Error in createCollection:", error);
      throw new Error("Failed to create collection");
    }
  }

  /**
   * Update a collection
   */
  static async updateCollection(
    userId: string,
    collectionId: string,
    data: Partial<ICreateCollection>
  ): Promise<ICollection | null> {
    try {
      const [updated] = await db
        .update(collections)
        .set({
          ...(data.name !== undefined && { name: data.name }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
        })
        .where(
          and(eq(collections.id, collectionId), eq(collections.userId, userId))
        )
        .returning();

      return updated || null;
    } catch (error) {
      console.error("Error in updateCollection:", error);
      throw new Error("Failed to update collection");
    }
  }

  /**
   * Delete a collection
   */
  static async deleteCollection(
    userId: string,
    collectionId: string
  ): Promise<boolean> {
    try {
      await db
        .delete(collections)
        .where(
          and(eq(collections.id, collectionId), eq(collections.userId, userId))
        );

      return true;
    } catch (error) {
      console.error("Error in deleteCollection:", error);
      throw new Error("Failed to delete collection");
    }
  }

  /**
   * Add a command to a collection
   */
  static async addCommandToCollection(
    collectionId: string,
    commandId: string,
    order?: number
  ): Promise<void> {
    try {
      await db
        .insert(collectionCommands)
        .values({
          collectionId,
          commandId,
          order: order ?? 0,
        })
        .onConflictDoNothing();
    } catch (error) {
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
    try {
      await db
        .delete(collectionCommands)
        .where(
          and(
            eq(collectionCommands.collectionId, collectionId),
            eq(collectionCommands.commandId, commandId)
          )
        );
    } catch (error) {
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
    try {
      await db
        .insert(collectionProcesses)
        .values({
          collectionId,
          processId,
          order: order ?? 0,
        })
        .onConflictDoNothing();
    } catch (error) {
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
    try {
      await db
        .delete(collectionProcesses)
        .where(
          and(
            eq(collectionProcesses.collectionId, collectionId),
            eq(collectionProcesses.processId, processId)
          )
        );
    } catch (error) {
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
  ): Promise<ICollection[]> {
    try {
      const result = await db
        .select({
          id: collections.id,
          name: collections.name,
          description: collections.description,
          userId: collections.userId,
          createdAt: collections.createdAt,
        })
        .from(collectionCommands)
        .innerJoin(
          collections,
          eq(collectionCommands.collectionId, collections.id)
        )
        .where(
          and(
            eq(collectionCommands.commandId, commandId),
            eq(collections.userId, userId)
          )
        );

      return result;
    } catch (error) {
      console.error("Error in getCollectionsForCommand:", error);
      throw new Error("Failed to fetch collections for command");
    }
  }
}
