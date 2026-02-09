import { supabase } from "@/supabase";
import type { ICommandUsageStats } from "@/types/STT";

export class UsageService {
  /**
   * Track a command usage (copy or view)
   */
  static async trackUsage(
    userId: string,
    commandId: string,
    action: "copy" | "view"
  ): Promise<void> {
    const { error } = await supabase.from("command_usage").insert({
      user_id: userId,
      command_id: commandId,
      action,
    });

    if (error) {
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
    const { data: usageRows, error: usageError } = await supabase
      .from("command_usage")
      .select("command_id, action, timestamp")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(2000);

    if (usageError) {
      console.error("Error getting user stats:", usageError);
      throw new Error("Failed to get usage statistics");
    }

    const rows = usageRows ?? [];

    const byCommand = new Map<
      string,
      { copy: number; view: number; lastUsed: string | null }
    >();
    let totalCopies = 0;
    let totalViews = 0;

    for (const r of rows) {
      totalCopies += r.action === "copy" ? 1 : 0;
      totalViews += r.action === "view" ? 1 : 0;
      const cur = byCommand.get(r.command_id) ?? {
        copy: 0,
        view: 0,
        lastUsed: null,
      };
      if (r.action === "copy") cur.copy += 1;
      if (r.action === "view") cur.view += 1;
      if (!cur.lastUsed || (r.timestamp && r.timestamp > cur.lastUsed)) {
        cur.lastUsed = r.timestamp ?? null;
      }
      byCommand.set(r.command_id, cur);
    }

    const sortedByTotal = [...byCommand.entries()]
      .map(([command_id, v]) => ({
        command_id,
        total_count: v.copy + v.view,
        copy_count: v.copy,
        view_count: v.view,
        last_used: v.lastUsed,
      }))
      .sort((a, b) => b.total_count - a.total_count)
      .slice(0, 10);

    const recentEntries = [...byCommand.entries()]
      .map(([command_id, v]) => ({ command_id, last_used: v.lastUsed }))
      .filter((e) => e.last_used)
      .sort(
        (a, b) =>
          (b.last_used ?? "").localeCompare(a.last_used ?? "")
      )
      .slice(0, 10);

    const commandIds = [
      ...new Set([
        ...sortedByTotal.map((e) => e.command_id),
        ...recentEntries.map((e) => e.command_id),
      ]),
    ].slice(0, 20);

    if (commandIds.length === 0) {
      return {
        mostUsed: [],
        recentlyUsed: [],
        totalCopies,
        totalViews,
      };
    }

    const { data: commandRows, error: cmdError } = await supabase
      .from("commands")
      .select("id, description, code, category_id, categories(name)")
      .in("id", commandIds);

    if (cmdError) {
      console.error("Error getting user stats (commands):", cmdError);
      throw new Error("Failed to get usage statistics");
    }

    const commandMap = new Map<
      string,
      {
        description: string | null;
        code: string | null;
        category_name: string | null;
      }
    >();
    for (const c of commandRows ?? []) {
      const cat = c.categories as { name: string } | null;
      commandMap.set(c.id, {
        description: c.description ?? null,
        code: c.code ?? null,
        category_name: cat?.name ?? null,
      });
    }

    const toStats = (
      command_id: string,
      copy_count: number,
      view_count: number,
      total_count: number,
      last_used: string | null
    ): ICommandUsageStats => {
      const info = commandMap.get(command_id);
      return {
        command_id,
        description: info?.description ?? null,
        code: info?.code ?? null,
        category_name: info?.category_name ?? null,
        copy_count,
        view_count,
        total_count,
        last_used,
      };
    };

    const mostUsed: ICommandUsageStats[] = sortedByTotal.map((e) => {
      const info = byCommand.get(e.command_id)!;
      return toStats(
        e.command_id,
        info.copy,
        info.view,
        e.total_count,
        info.lastUsed
      );
    });

    const recentlyUsed: ICommandUsageStats[] = recentEntries.map((e) => {
      const info = byCommand.get(e.command_id)!;
      return toStats(
        e.command_id,
        info.copy,
        info.view,
        info.copy + info.view,
        info.lastUsed
      );
    });

    return {
      mostUsed,
      recentlyUsed,
      totalCopies,
      totalViews,
    };
  }

  /**
   * Get usage stats for a specific command
   */
  static async getCommandStats(
    commandId: string
  ): Promise<{ copyCount: number; viewCount: number }> {
    const [
      { count: copyCount },
      { count: viewCount },
    ] = await Promise.all([
      supabase
        .from("command_usage")
        .select("*", { count: "exact", head: true })
        .eq("command_id", commandId)
        .eq("action", "copy"),
      supabase
        .from("command_usage")
        .select("*", { count: "exact", head: true })
        .eq("command_id", commandId)
        .eq("action", "view"),
    ]);

    return {
      copyCount: copyCount ?? 0,
      viewCount: viewCount ?? 0,
    };
  }
}
