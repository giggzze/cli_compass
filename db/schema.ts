import {
	pgTable,
	unique,
	text,
	timestamp,
	foreignKey,
	uniqueIndex,
	boolean,
	primaryKey,
	integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const categories = pgTable(
	"categories",
	{
		id: text()
			.default(sql`uuid_generate_v4()`)
			.primaryKey()
			.notNull(),
		name: text().notNull(),
	},
	table => {
		return {
			categoriesNameUnique: unique("categories_name_unique").on(
				table.name
			),
		};
	}
);

export const commands = pgTable(
	"commands",
	{
		id: text()
			.default(sql`uuid_generate_v4()`)
			.primaryKey()
			.notNull(),
		name: text().notNull(),
		description: text().notNull(),
		usage: text().notNull(),
		categoryId: text("category_id").notNull(),
		isPrivate: boolean("is_private").default(true).notNull(),
	},
	table => {
		return {
			commandsCategoryIdCategoriesIdFk: foreignKey({
				columns: [table.categoryId],
				foreignColumns: [categories.id],
				name: "commands_category_id_categories_id_fk",
			}),
		};
	}
);

export const tags = pgTable(
	"tags",
	{
		id: text()
			.default(sql`uuid_generate_v4()`)
			.primaryKey()
			.notNull(),
		name: text().notNull(),
	},
	table => {
		return {
			tagsNameUnique: unique("tags_name_unique").on(table.name),
		};
	}
);

export const userCommands = pgTable(
	"user_commands",
	{
		id: text()
			.default(sql`uuid_generate_v4()`)
			.primaryKey()
			.notNull(),
		userId: text("user_id").notNull(),
		commandId: text("command_id").notNull(),
		isFavorite: boolean("is_favorite").default(false).notNull(),
		lastUsed: timestamp("last_used", { mode: "string" }).defaultNow(),
	},
	table => {
		return {
			userCommandUnique: uniqueIndex("user_command_unique").using(
				"btree",
				table.userId.asc().nullsLast().op("text_ops"),
				table.commandId.asc().nullsLast().op("text_ops")
			),
			userCommandsCommandIdCommandsIdFk: foreignKey({
				columns: [table.commandId],
				foreignColumns: [commands.id],
				name: "user_commands_command_id_commands_id_fk",
			}),
			userCommandsUserIdUserProfilesIdFk: foreignKey({
				columns: [table.userId],
				foreignColumns: [userProfiles.id],
				name: "user_commands_user_id_user_profiles_id_fk",
			}),
		};
	}
);

export const userProfiles = pgTable("user_profiles", {
	id: text()
		.default(sql`uuid_generate_v4()`)
		.primaryKey()
		.notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: "string" })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.defaultNow()
		.notNull(),
});

export const commandTags = pgTable(
	"command_tags",
	{
		commandId: text("command_id").notNull(),
		tagId: text("tag_id").notNull(),
	},
	table => {
		return {
			commandTagsCommandIdCommandsIdFk: foreignKey({
				columns: [table.commandId],
				foreignColumns: [commands.id],
				name: "command_tags_command_id_commands_id_fk",
			}),
			commandTagsTagIdTagsIdFk: foreignKey({
				columns: [table.tagId],
				foreignColumns: [tags.id],
				name: "command_tags_tag_id_tags_id_fk",
			}),
			commandTagsCommandIdTagIdPk: primaryKey({
				columns: [table.commandId, table.tagId],
				name: "command_tags_command_id_tag_id_pk",
			}),
		};
	}
);

export const processes = pgTable("processes", {
	id: text("id")
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	title: text("title").notNull(),
	user_id: text("user_id")
		.references(() => userProfiles.id)
		.notNull(),
});

export const processSteps = pgTable("process_steps", {
	id: text("id")
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	process_id: text("process_id")
		.references(() => processes.id)
		.notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	code_block: text("code_block"),
	order: integer("order").notNull(),
});
