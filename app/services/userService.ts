import { db } from "@/db";
import { profiles } from "@/db/schema";
import { supabase } from "@/supabase";

export class UserService {
  /**
   * Checks if the given user is the owner of the specified command.
   *
   * @param userId - The ID of the user.
   * @param commandId - The ID of the command.
   * @returns `true` if the user is the owner of the command, otherwise `false`.
   */
  static isOwner(userId: string, commandId: string) {
    return userId === commandId;
  }

  static async userExists(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .single();

    if (data) return true;
    return false;
  }

  static async createProfile(
    userId: string,
    username: string,
    userImageUrl: string
  ) {
    {
      const newProfile = await db
        .insert(profiles)
        .values({
          id: userId,
          username,
          avatarUrl: userImageUrl,
        })
        .returning();

      if (newProfile) return true;
      return false;
    }
  }
}
