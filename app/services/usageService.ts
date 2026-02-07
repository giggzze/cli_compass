import { db } from "@/db";
import { commandUsage, commands, categories } from "@/db/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";

export interface IUsageRecord {
  id: string;
  commandId: string;
  userId: string;
  action: string;
  timestamp: string | null;
}

export interface ICommandUsageStats {
  commandId: string;
  description: string | null;
  code: string | null;
  categoryName: string | null;
  copyCount: number;
  viewCount: number;
  totalCount: number;
  lastUsed: string | null;
}

export class UsageService {
  /**
   * Track a command usage (copy or view)
   */
  static async trackUsage(
    userId: string,
    commandId: string,
    action: "copy" | "view"
  ): Promise<void> {
    try {
      await db.insert(commandUsage).values({
        userId,
        commandId,
        action,
      });
    } catch (error) {
      console.error("Error tracking usage:", error);
      // Don't throw - tracking failures shouldn't break the app
    }
  }

  /**
   * Get usage statistics for a user's commands
   */
  static async getUserStats(userId: string): Promise<{
    mostUsed: ICommandUsageStats[];
    recentlyUsed: ICommandUsageStats[];
    totalCopies: number;
    totalViews: number;
  }> {
    try {
      // Get most used commands
      const mostUsed = await db
        .select({
          commandId: commandUsage.commandId,
          description: commands.description,
          code: commands.code,
          categoryName: categories.name,
          totalCount: count(),
        })
        .from(commandUsage)
        .innerJoin(commands, eq(commandUsage.commandId, commands.id))
        .leftJoin(categories, eq(commands.categoryId, categories.id))
        .where(eq(commandUsage.userId, userId))
        .groupBy(
          commandUsage.commandId,
          commands.description,
          commands.code,
          categories.name
        )
        .orderBy(desc(count()))
        .limit(10);

      // Get recently used commands
      const recentlyUsed = await db
        .select({
          commandId: commandUsage.commandId,
          description: commands.description,
          code: commands.code,
          categoryName: categories.name,
          timestamp: commandUsage.timestamp,
        })
        .from(commandUsage)
        .innerJoin(commands, eq(commandUsage.commandId, commands.id))
        .leftJoin(categories, eq(commands.categoryId, categories.id))
        .where(eq(commandUsage.userId, userId))
        .orderBy(desc(commandUsage.timestamp))
        .limit(10);

      // Dedupe recently used
      const seen = new Set<string>();
      const uniqueRecent = recentlyUsed.filter((item) => {
        if (seen.has(item.commandId)) return false;
        seen.add(item.commandId);
        return true;
      });

      // Get total counts
      const totals = await db
        .select({
          action: commandUsage.action,
          count: count(),
        })
        .from(commandUsage)
        .where(eq(commandUsage.userId, userId))
        .groupBy(commandUsage.action);

      const totalCopies =
        totals.find((t) => t.action === "copy")?.count || 0;
      const totalViews = totals.find((t) => t.action === "view")?.count || 0;

      return {
        mostUsed: mostUsed.map((item) => ({
          commandId: item.commandId,
          description: item.description,
          code: item.code,
          categoryName: item.categoryName,
          copyCount: 0, // Would need separate query
          viewCount: 0,
          totalCount: Number(item.totalCount),
          lastUsed: null,
        })),
        recentlyUsed: uniqueRecent.map((item) => ({
          commandId: item.commandId,
          description: item.description,
          code: item.code,
          categoryName: item.categoryName,
          copyCount: 0,
          viewCount: 0,
          totalCount: 0,
          lastUsed: item.timestamp,
        })),
        totalCopies: Number(totalCopies),
        totalViews: Number(totalViews),
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      throw new Error("Failed to get usage statistics");
    }
  }

  /**
   * Get usage stats for a specific command
   */
  static async getCommandStats(
    commandId: string
  ): Promise<{ copyCount: number; viewCount: number }> {
    try {
      const stats = await db
        .select({
          action: commandUsage.action,
          count: count(),
        })
        .from(commandUsage)
        .where(eq(commandUsage.commandId, commandId))
        .groupBy(commandUsage.action);

      return {
        copyCount: Number(stats.find((s) => s.action === "copy")?.count || 0),
        viewCount: Number(stats.find((s) => s.action === "view")?.count || 0),
      };
    } catch (error) {
      console.error("Error getting command stats:", error);
      return { copyCount: 0, viewCount: 0 };
    }
  }
}
