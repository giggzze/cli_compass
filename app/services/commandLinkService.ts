import { supabase } from "@/supabase";
import type { CommandLink, ILinkedCommand } from "@/types/STT";

export class CommandLinkService {
  /**
   * Get all related commands for a given command
   */
  static async getRelatedCommands(commandId: string): Promise<ILinkedCommand[]> {
    const [asSourceRes, asTargetRes] = await Promise.all([
      supabase
        .from("command_links")
        .select(
          "relationship_type, commands!command_links_related_command_id_fkey(id, description, code, category_id, categories(id, name))"
        )
        .eq("command_id", commandId),
      supabase
        .from("command_links")
        .select(
          "relationship_type, commands!command_links_command_id_fkey(id, description, code, category_id, categories(id, name))"
        )
        .eq("related_command_id", commandId),
    ]);

    const fromSource = (asSourceRes.data ?? []).map((row: { relationship_type: string | null; commands: unknown }) => {
      const cmd = row.commands as Record<string, unknown> | null;
      if (!cmd) return null;
      return {
        ...cmd,
        relationship_type: row.relationship_type,
      };
    }).filter(Boolean) as ILinkedCommand[];

    const fromTarget = (asTargetRes.data ?? []).map((row: { relationship_type: string | null; commands: unknown }) => {
      const cmd = row.commands as Record<string, unknown> | null;
      if (!cmd) return null;
      return {
        ...cmd,
        relationship_type: row.relationship_type,
      };
    }).filter(Boolean) as ILinkedCommand[];

    const allLinked = [...fromSource, ...fromTarget];
    const seen = new Set<string>();
    return allLinked.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }

  /**
   * Create a link between two commands
   */
  static async createLink(
    commandId: string,
    relatedCommandId: string,
    relationshipType: string = "related"
  ): Promise<CommandLink> {
    if (commandId === relatedCommandId) {
      throw new Error("Cannot link a command to itself");
    }

    const { data, error } = await supabase
      .from("command_links")
      .insert({
        command_id: commandId,
        related_command_id: relatedCommandId,
        relationship_type: relationshipType,
      })
      .select()
      .single();

    if (error) {
      console.error("Error in createLink:", error);
      throw new Error("Failed to create command link");
    }
    return data as CommandLink;
  }

  /**
   * Remove a link between two commands
   */
  static async removeLink(
    commandId: string,
    relatedCommandId: string
  ): Promise<boolean> {
    const { error: e1 } = await supabase
      .from("command_links")
      .delete()
      .eq("command_id", commandId)
      .eq("related_command_id", relatedCommandId);

    if (e1) {
      console.error("Error in removeLink:", e1);
      throw new Error("Failed to remove command link");
    }

    const { error: e2 } = await supabase
      .from("command_links")
      .delete()
      .eq("command_id", relatedCommandId)
      .eq("related_command_id", commandId);

    if (e2) {
      console.error("Error in removeLink (reverse):", e2);
    }
    return true;
  }

  /**
   * Check if two commands are linked
   */
  static async areLinked(
    commandId: string,
    relatedCommandId: string
  ): Promise<boolean> {
    const { data: d1 } = await supabase
      .from("command_links")
      .select("id")
      .eq("command_id", commandId)
      .eq("related_command_id", relatedCommandId)
      .limit(1)
      .maybeSingle();

    if (d1) return true;

    const { data: d2 } = await supabase
      .from("command_links")
      .select("id")
      .eq("command_id", relatedCommandId)
      .eq("related_command_id", commandId)
      .limit(1)
      .maybeSingle();

    return !!d2;
  }

  /**
   * Update the relationship type of a link
   */
  static async updateLinkType(
    commandId: string,
    relatedCommandId: string,
    relationshipType: string
  ): Promise<boolean> {
    const { error: e1 } = await supabase
      .from("command_links")
      .update({ relationship_type: relationshipType })
      .eq("command_id", commandId)
      .eq("related_command_id", relatedCommandId);

    if (!e1) return true;

    const { error: e2 } = await supabase
      .from("command_links")
      .update({ relationship_type: relationshipType })
      .eq("command_id", relatedCommandId)
      .eq("related_command_id", commandId);

    if (e2) {
      console.error("Error in updateLinkType:", e2);
      throw new Error("Failed to update link type");
    }
    return true;
  }
}
