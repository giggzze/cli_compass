import {
	categories,
	commands,
	userCommands,
	processes,
	processSteps,
	profiles,
} from "@/db/schema";

// types from the database
export type Category = typeof categories.$inferSelect;
export type Command = typeof commands.$inferSelect;
export type UserCommand = typeof userCommands.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Process = typeof processes.$inferSelect;
export type ProcessStep = typeof processSteps.$inferSelect;





export interface CategoryFormData {
	name: string;
}




// interfaces for API responses
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}
