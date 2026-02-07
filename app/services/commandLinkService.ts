import { db } from "@/db";
import { commandLinks, commands, categories, userCommands } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";

export interface ICommandLink {
  id: string;
  commandId: string;
  relatedCommandId: string;
  relationshipType: string | null;
}

export interface ILinkedCommand {
  id: string;
  description: string | null;
  code: string | null;
  categoryId: string | null;
  relationshipType: string | null;
  category?: {
    id: string;
    name: string | null;
  };
}

export class CommandLinkService {
  /**
   * Get all related commands for a given command
   */
  static async getRelatedCommands(commandId: string): Promise<ILinkedCommand[]> {
    try {
      // Get commands where this command is the source
      const linkedAsSource = await db
        .select({
          id: commands.id,
          description: commands.description,
          code: commands.code,
          categoryId: commands.categoryId,
          relationshipType: commandLinks.relationshipType,
          category: {
            id: categories.id,
            name: categories.name,
          },
        })
        .from(commandLinks)
        .innerJoin(commands, eq(commandLinks.relatedCommandId, commands.id))
        .leftJoin(categories, eq(commands.categoryId, categories.id))
        .where(eq(commandLinks.commandId, commandId));

      // Get commands where this command is the target
      const linkedAsTarget = await db
        .select({
          id: commands.id,
          description: commands.description,
          code: commands.code,
          categoryId: commands.categoryId,
          relationshipType: commandLinks.relationshipType,
          category: {
            id: categories.id,
            name: categories.name,
          },
        })
        .from(commandLinks)
        .innerJoin(commands, eq(commandLinks.commandId, commands.id))
        .leftJoin(categories, eq(commands.categoryId, categories.id))
        .where(eq(commandLinks.relatedCommandId, commandId));

      // Combine and dedupe
      const allLinked = [...linkedAsSource, ...linkedAsTarget];
      const uniqueLinked = allLinked.filter(
        (cmd, index, self) => index === self.findIndex((c) => c.id === cmd.id)
      );

      return uniqueLinked;
    } catch (error) {
      console.error("Error in getRelatedCommands:", error);
      throw new Error("Failed to fetch related commands");
    }
  }

  /**
   * Create a link between two commands
   */
  static async createLink(
    commandId: string,
    relatedCommandId: string,
    relationshipType: string = "related"
  ): Promise<ICommandLink> {
    try {
      // Don't allow linking a command to itself
      if (commandId === relatedCommandId) {
        throw new Error("Cannot link a command to itself");
      }

      const [newLink] = await db
        .insert(commandLinks)
        .values({
          commandId,
          relatedCommandId,
          relationshipType,
        })
        .returning();

      return newLink;
    } catch (error) {
      console.error("Error in createLink:", error);
      throw new Error("Failed to create command link");
    }
  }

  /**
   * Remove a link between two commands
   */
  static async removeLink(
    commandId: string,
    relatedCommandId: string
  ): Promise<boolean> {
    try {
      // Remove link in both directions
      await db.delete(commandLinks).where(
        or(
          and(
            eq(commandLinks.commandId, commandId),
            eq(commandLinks.relatedCommandId, relatedCommandId)
          ),
          and(
            eq(commandLinks.commandId, relatedCommandId),
            eq(commandLinks.relatedCommandId, commandId)
          )
        )
      );

      return true;
    } catch (error) {
      console.error("Error in removeLink:", error);
      throw new Error("Failed to remove command link");
    }
  }

  /**
   * Check if two commands are linked
   */
  static async areLinked(
    commandId: string,
    relatedCommandId: string
  ): Promise<boolean> {
    try {
      const result = await db
        .select()
        .from(commandLinks)
        .where(
          or(
            and(
              eq(commandLinks.commandId, commandId),
              eq(commandLinks.relatedCommandId, relatedCommandId)
            ),
            and(
              eq(commandLinks.commandId, relatedCommandId),
              eq(commandLinks.relatedCommandId, commandId)
            )
          )
        )
        .limit(1);

      return result.length > 0;
    } catch (error) {
      console.error("Error in areLinked:", error);
      throw new Error("Failed to check command link");
    }
  }

  /**
   * Update the relationship type of a link
   */
  static async updateLinkType(
    commandId: string,
    relatedCommandId: string,
    relationshipType: string
  ): Promise<boolean> {
    try {
      await db
        .update(commandLinks)
        .set({ relationshipType })
        .where(
          or(
            and(
              eq(commandLinks.commandId, commandId),
              eq(commandLinks.relatedCommandId, relatedCommandId)
            ),
            and(
              eq(commandLinks.commandId, relatedCommandId),
              eq(commandLinks.relatedCommandId, commandId)
            )
          )
        );

      return true;
    } catch (error) {
      console.error("Error in updateLinkType:", error);
      throw new Error("Failed to update link type");
    }
  }
}
