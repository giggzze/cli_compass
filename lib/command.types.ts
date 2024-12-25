import { Category, Command } from "./db.types";

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
	user: {
		id: string;
		username: string | null;
		avatarUrl: string | null;
	} | null;
}

// interfaces for forms
export interface CommandFormData {
	code: string;
	categoryId: string;
	customCategory?: string;
	isPrivate: boolean;
}
