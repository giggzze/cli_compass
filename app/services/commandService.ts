import { supabase } from "@/supabase";
import type {
    Command,
    CommandInsert, GetCommand,
    UserCommandInsert,
} from "@/types/STT";

function mapRowToGetCommand(row: {
  id: string;
  description: string;
  code: string;
  is_private: boolean;
  category_id: string;
  doc_url: string | null;
  language: string | null;
  created_at: string;
  user_id: string | null;
  categories?: { id: string; name: string } | null;
  profiles?: { id: string; username: string | null; avatar_url: string | null } | null;
  is_favorite?: boolean;
}): GetCommand {
  return {
    id: row.id,
    description: row.description,
    code: row.code,
    isPrivate: row.is_private,
    categoryId: row.category_id,
    docUrl: row.doc_url,
    language: row.language,
    createdAt: row.created_at,
    userId: row.user_id,
    category: row.categories
      ? { id: row.categories.id, name: row.categories.name }
      : null,
    user: row.profiles
      ? {
          id: row.profiles.id,
          username: row.profiles.username,
          avatar_url: row.profiles.avatar_url,
        }
      : null,
    isFavorite: row.is_favorite ?? undefined,
  };
}

export class CommandService {
  /**
   * Retrieves a list of public commands from the database.
   */
  static async getPublicCommands(): Promise<GetCommand[]> {
    const { data, error } = await supabase
      .from("commands")
      .select("id, description, code, is_private, category_id, doc_url, language, created_at, user_id, categories(id, name)")
      .eq("is_private", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error in getPublicCommands:", error);
      throw new Error("Failed to fetch public commands");
    }

    return (data ?? []).map((row) => {
      const r = row as Record<string, unknown>;
      const cat = r.categories;
      const categories =
        cat == null
          ? null
          : Array.isArray(cat)
            ? (cat[0] as { id: string; name: string }) ?? null
            : (cat as { id: string; name: string });
      return mapRowToGetCommand({
        ...row,
        categories,
        profiles: null,
      } as Parameters<typeof mapRowToGetCommand>[0]);
    });
  }

  /**
   * Retrieves a list of commands associated with a specific user.
   */
  static async getUserCommands(userId: string): Promise<Command[]> {
    const { data, error } = await supabase
      .from("user_commands")
      .select(
        "*, commands(*), profiles(*)"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error in getUserCommands:", error);
      throw new Error("Failed to fetch user commands");
    }

    return (data ?? []).map((row) => {
      const r = row as unknown as {
        commands: Record<string, unknown> | Record<string, unknown>[] | null;
        profiles: Record<string, unknown> | Record<string, unknown>[] | null;
        is_favorite: boolean;
      };
      const cmd = Array.isArray(r.commands) ? r.commands[0] : r.commands;
      const prof = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
      if (!cmd) return null;
      const cat = cmd.categories;
      const categories =
        cat == null
          ? null
          : Array.isArray(cat)
            ? (cat[0] as { id: string; name: string }) ?? null
            : (cat as { id: string; name: string });
      return mapRowToGetCommand({
        id: cmd.id as string,
        description: cmd.description as string,
        code: cmd.code as string,
        is_private: cmd.is_private as boolean,
        category_id: cmd.category_id as string,
        doc_url: (cmd.doc_url as string | null) ?? null,
        language: (cmd.language as string | null) ?? null,
        created_at: cmd.created_at as string,
        user_id: (cmd.user_id as string | null) ?? null,
        categories,
        profiles: prof
          ? {
              id: prof.id as string,
              username: prof.username as string | null,
              avatar_url: prof.avatar_url as string | null,
            }
          : null,
        is_favorite: r.is_favorite,
      });
    }).filter(Boolean) as GetCommand[];
  }

  /**
   * Creates a new command and associates it with a user.
   */
  static async createCommand(command: CommandInsert): Promise<boolean> {

    const { data: newCommand, error: cmdError } = await supabase
      .from("commands")
      .insert(command)
      .select("id")
      .single();

    if (cmdError || !newCommand) {
      console.error("Error in createCommand:", cmdError);
      throw new Error("Failed to create command");
    }

    const ucInsert: UserCommandInsert = {
      user_id: command.user_id,
      command_id: newCommand.id,
      is_favorite: false,
    };

    const { error: ucError } = await supabase.from("user_commands").insert(ucInsert);

    if (ucError) {
      console.error("Error in createCommand (user_commands):", ucError);
      throw new Error("Failed to create command");
    }

    return true;
  }

  /**
   * Checks if a user is associated with a specific command.
   */
  static async checkUserAssociation(
    userId: string,
    command_id: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("user_commands")
      .select("id")
      .eq("user_id", userId)
      .eq("command_id", command_id)
      .limit(1)
      .maybeSingle();

    if (error) return false;
    return data != null;
  }

  /**
   * Updates the association of a user with a command (e.g. is_favorite).
   */
  static async updateUserAssociation(
    userId: string,
    command_id: string,
    is_favorite: boolean
  ): Promise<void> {
    const { error } = await supabase
      .from("user_commands")
      .update({ is_favorite })
      .eq("user_id", userId)
      .eq("command_id", command_id);

    if (error) {
      console.error("Error in updateUserAssociation:", error);
      throw new Error("Failed to update association");
    }
  }

  /**
   * Creates a new association between a user and a command.
   */
  static async createUserAssociation(
    userId: string,
    command_id: string,
    is_favorite: boolean
  ): Promise<void> {
    const { error } = await supabase.from("user_commands").insert({
      user_id: userId,
      command_id,
      is_favorite,
    });

    if (error) {
      console.error("Error in createUserAssociation:", error);
      throw new Error("Failed to create association");
    }
  }

  /**
   * Gets a single command for a user (by user_commands link).
   */
  static async getUserCommand(
    userId: string,
    commandId: string
  ): Promise<GetCommand> {
    const { data, error } = await supabase
      .from("user_commands")
      .select(
        "is_favorite, commands(id, description, code, is_private, category_id, doc_url, language, created_at, user_id, categories(id, name)), profiles(id, username, avatar_url)"
      )
      .eq("user_id", userId)
      .eq("command_id", commandId)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error("Error in getUserCommand:", error);
      throw new Error("Command not found");
    }

    const row = data as unknown as {
      commands: Record<string, unknown> | Record<string, unknown>[] | null;
      profiles: Record<string, unknown> | Record<string, unknown>[] | null;
      is_favorite: boolean;
    };
    const cmd = Array.isArray(row.commands) ? row.commands[0] : row.commands;
    if (!cmd) throw new Error("Command not found");

    const prof = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const cat = cmd.categories;
    const categories =
      cat == null
        ? null
        : Array.isArray(cat)
          ? (cat[0] as { id: string; name: string }) ?? null
          : (cat as { id: string; name: string });

    return mapRowToGetCommand({
      id: cmd.id as string,
      description: cmd.description as string,
      code: cmd.code as string,
      is_private: cmd.is_private as boolean,
      category_id: cmd.category_id as string,
      doc_url: (cmd.doc_url as string | null) ?? null,
      language: (cmd.language as string | null) ?? null,
      created_at: cmd.created_at as string,
      user_id: (cmd.user_id as string | null) ?? null,
      categories,
      profiles: prof
        ? {
            id: prof.id as string,
            username: prof.username as string | null,
            avatar_url: prof.avatar_url as string | null,
          }
        : null,
      is_favorite: row.is_favorite,
    });
  }

  /**
   * Toggles the favorite flag for a user's command.
   */
  static async updateFavorite(
    userId: string,
    commandId: string
  ): Promise<boolean> {
    const exists = await this.checkUserAssociation(userId, commandId);
    if (!exists) return false;

    const command = await this.getUserCommand(userId, commandId);
    await this.updateUserAssociation(
      userId,
      commandId,
      !command.isFavorite
    );
    return true;
  }
}
