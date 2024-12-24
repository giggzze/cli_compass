import { supabase } from "@/supabase";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

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
			.from('user_profiles')
			.select()
			.eq('id', userId)
			.single();
		return data;
	}
}
