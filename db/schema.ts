import { sql } from "drizzle-orm";
import {
	pgTable,
	serial,
	text,
	timestamp,
	integer,
	primaryKey,
	uuid,
	boolean,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
	id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
	name: text("name").notNull().unique(),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const commands = pgTable("commands", {
	id: text("id")
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	name: text("name").notNull(),
	description: text("description").notNull(),
	usage: text("usage").notNull(),
	category_id: text("category_id")
		.references(() => categories.id)
		.notNull(),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const tags = pgTable("tags", {
	id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
	name: text("name").notNull().unique(),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const commandTags = pgTable(
	"command_tags",
	{
		command_id: text("command_id")
			.references(() => commands.id)
			.notNull(),
		tag_id: text("tag_id")
			.references(() => tags.id)
			.notNull(),
		created_at: timestamp("created_at").defaultNow().notNull(),
		updated_at: timestamp("updated_at").defaultNow().notNull(),
	},
	table => ({
		pk: primaryKey(table.command_id, table.tag_id),
	})
);

export const userProfiles = pgTable("user_profiles", {
	id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
	email: text("email").notNull().unique(),
	username: text("username").notNull().unique(),
	full_name: text("full_name"),
	avatar_url: text("avatar_url"),
	is_active: boolean("is_active").default(true).notNull(),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const userCommands = pgTable(
	"user_commands",
	{
		id: text("id")
			.primaryKey()
			.default(sql`uuid_generate_v4()`),
		user_id: text("user_id")
			.references(() => userProfiles.id)
			.notNull(),
		command_id: text("command_id")
			.references(() => commands.id)
			.notNull(),
		is_favorite: boolean("is_favorite").default(false).notNull(),
		notes: text("notes"),
		last_used: timestamp("last_used").defaultNow(),
		created_at: timestamp("created_at").defaultNow().notNull(),
		updated_at: timestamp("updated_at").defaultNow().notNull(),
	},
	table => {
		return {
			userCommandUnique: uniqueIndex("user_command_unique").on(
				table.user_id,
				table.command_id
			),
		};
	}
);
