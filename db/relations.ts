import { relations } from "drizzle-orm/relations";
import { categories, commands, userCommands, userProfiles, commandTags, tags } from "./schema";

export const commandsRelations = relations(commands, ({one, many}) => ({
	category: one(categories, {
		fields: [commands.categoryId],
		references: [categories.id]
	}),
	userCommands: many(userCommands),
	commandTags: many(commandTags),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	commands: many(commands),
}));

export const userCommandsRelations = relations(userCommands, ({one}) => ({
	command: one(commands, {
		fields: [userCommands.commandId],
		references: [commands.id]
	}),
	userProfile: one(userProfiles, {
		fields: [userCommands.userId],
		references: [userProfiles.id]
	}),
}));

export const userProfilesRelations = relations(userProfiles, ({many}) => ({
	userCommands: many(userCommands),
}));

export const commandTagsRelations = relations(commandTags, ({one}) => ({
	command: one(commands, {
		fields: [commandTags.commandId],
		references: [commands.id]
	}),
	tag: one(tags, {
		fields: [commandTags.tagId],
		references: [tags.id]
	}),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	commandTags: many(commandTags),
}));