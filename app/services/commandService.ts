import { supabase } from "@/supabase";
import type {
  Command,
  CommandInsert,
  PublicCommand,
  UserCommandCombined,
  UserCommandCombinedWithCategory,
  UserCommandInsert,
} from "@/types/STT";

export class CommandService {
  /**
   * Retrieves a list of public commands from the database.
   */
  static async getPublicCommands(): Promise<PublicCommand[]> {
    const { data, error } = await supabase
      .from("commands")
      .select("*, categories(*)")
      .eq("is_private", false)
      .order("created_at", { ascending: false });

    if (error) {
      return [] as PublicCommand[];
    }

    return data;
  }

  /**
   * Retrieves a list of commands associated with a specific user.
   */
  static async getUserCommands(userId: string): Promise<UserCommandCombined[]> {
    const { data, error } = await supabase
      .from("user_commands")
      .select("*, commands(*), profiles(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return [] as UserCommandCombined[];
    }

    return data as UserCommandCombined[];
  }

  /**
   * Gets a single command for a user (by user_commands link).
   */
  static async getUserCommand(
    userId: string,
    commandId: string,
  ): Promise<UserCommandCombinedWithCategory> {
    const { data, error } = await supabase
      .from("user_commands")
      .select("*, commands(*), categories(*), profiles(*)")
      .eq("user_id", userId)
      .eq("command_id", commandId)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return {} as UserCommandCombinedWithCategory;
    }

    return data as UserCommandCombinedWithCategory;
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

    if (cmdError) {
      return false;
    }

    const ucInsert: UserCommandInsert = {
      user_id: command.user_id,
      command_id: newCommand.id,
      is_favorite: false,
    };

    const { error: ucError } = await supabase
      .from("user_commands")
      .insert(ucInsert)
      .select();

    if (ucError) {
      return false;
    }

    return true;
  }

  /**
   * Checks if a user is associated with a specific command.
   */
  static async checkUserAssociation(
    userId: string,
    command_id: string,
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("user_commands")
      .select("id")
      .eq("user_id", userId)
      .eq("command_id", command_id)
      .limit(1)
      .maybeSingle();

    if (error) return false;
    return !!data;
  }

  /**
   * Updates the association of a user with a command (e.g. is_favorite).
   */
  static async updateUserAssociation(
    userId: string,
    command_id: string,
    is_favorite: boolean,
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
    is_favorite: boolean,
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
   * Toggles the favorite flag for a user's command.
   */
  static async updateFavorite(
    userId: string,
    commandId: string,
  ): Promise<boolean> {
    const exists = await this.checkUserAssociation(userId, commandId);
    if (!exists) return false;

    const command = await this.getUserCommand(userId, commandId);
    await this.updateUserAssociation(userId, commandId, !command.is_favorite);
    return true;
  }
}
