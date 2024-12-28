import { commands, userCommands } from "@/db/schema";
import { ICategory } from "./Category";
import {IProfile} from "@/app/models/Profile";


export type ICommand = typeof commands.$inferSelect;
export type IUserCommand = typeof userCommands.$inferSelect;

// interfaces for commands
export interface ICreateCommand {
	description: string;
	code: string;
	isPrivate: boolean;
	categoryId: string;
}

export interface IUpdateCommand {
	description?: string;
	code?: string;
	isPrivate?: boolean;
	categoryId?: string;
}

export interface IGetCommand extends ICommand {
	category: ICategory | null;
	isFavorite?: boolean | null;
	user: IProfile | null;
}

// interfaces for forms
export interface ICommandFormData {
	code: string;
	categoryId: string;
	customCategory?: string;
	isPrivate: boolean;
}
