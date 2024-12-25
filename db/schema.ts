import {
	pgTable,
	unique,
	text,
	foreignKey,
	uniqueIndex,
	boolean,
	primaryKey,
	integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const categories = pgTable("categories", {
	id: text("id")
		.default(sql`uuid_generate_v4()`)
		.primaryKey()
		.notNull(),
	name: text("name"),
});

export const commands = pgTable("commands", {
	id: text("id")
		.default(sql`uuid_generate_v4()`)
		.primaryKey()
		.notNull(),
	description: text("description"),
	code: text("code"),
	categoryId: text("category_id"),
	isPrivate: boolean("is_private").default(true),
	createdAt: text("created_at").default(sql`now()`),
});

export const userCommands = pgTable("user_commands", {
	id: text("id")
		.default(sql`uuid_generate_v4()`)
		.primaryKey()
		.notNull(),
	userId: text("user_id"),
	commandId: text("command_id"),
	isFavorite: boolean("is_favorite").default(false),
});

export const profiles = pgTable("profiles", {
	id: text("id")
		.default(sql`uuid_generate_v4()`)
		.primaryKey()
		.notNull(),
	username: text("username"),
	avatarUrl: text("avatar_url"),
});

export const processes = pgTable("processes", {
	id: text("id")
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	title: text("title"),
	userId: text("user_id"),
	createdAt: text("created_at").default(sql`now()`),
});

export const processSteps = pgTable("process_steps", {
	id: text("id")
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	processId: text("process_id"),
	stepExplanation: text("stepExplanation"),
	code: text("code"),
	order: integer("order"),
});
