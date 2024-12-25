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



// interfaces for commands
export interface CreateCommandDTO {
	description: string;
	code: string;
	isPrivate: boolean;
	categoryId: string;
}

export interface UpdateCommandDTO {
	description?: string;
	code?: string;
	isPrivate?: boolean;
	categoryId?: string;
}

export interface GetCommandDTO extends Command {
	category: Category | null;
	isFavorite?: boolean | null;
	lastUsed?: string;
	user: {
		id: string;
		username: string;
		avatarUrl: string;
	} | null;
}

export interface GetCommandAndUserDTO extends Command {
	isFavorite: boolean;
	category: Category | null;
	user: {
		id: string;
		username: string;
		avatarUrl: string;
	} | null;
}

// interfaces for forms
export interface CommandFormData {
	code: string;
	categoryId: string;
	customCategory?: string;
	isPrivate: boolean;
}

export interface CategoryFormData {
	name: string;
}



// interfaces for processes
export interface GetProcessWithStepDto extends Process {
	steps: ProcessStep[];
}

export interface CreateProcessStepDto {
	processId: string;
	title: string;
	stepExplanation: string;
	code: string;
	order: number;
}

export interface UpdateProcessStepsDto extends Partial<CreateProcessStepDto> {}


// interfaces for API responses
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}
