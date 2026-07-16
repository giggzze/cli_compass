import {supabase} from "@/supabase";
import {ProfileInsert} from "@/types/STT";

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
        const {data} = await supabase
            .from("profiles")
            .select()
            .eq("id", userId)
            .single();

        return !!data;
    }

    static async createProfile(profile: ProfileInsert) {
        const {data, error} = await supabase
            .from("profiles")
            .insert(profile)
            .select()
            .single();

        if (error) {
            console.error("Error creating profile:", error);
            return false;
        }

        return !!data;
    }
}
