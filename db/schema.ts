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

export const categories = pgTable(
	"categories",
	{
	  id: text().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	  name: text().notNull(),
	},
	(table) => {
	  return {
		categoriesNameUnique: unique("categories_name_unique").on(sql`lower(${table.name})`),
	  };
	}
  );
  
  export const commands = pgTable(
	"commands",
	{
	  id: text().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	  description: text().notNull(),
	  code: text().notNull(),
	  categoryId: text("category_id").notNull(),
	  isPrivate: boolean("is_private").default(true).notNull(),
	},
	(table) => {
	  return {
		commandsCategoryIdCategoriesIdFk: foreignKey({
		  columns: [table.categoryId],
		  foreignColumns: [categories.id],
		  name: "commands_category_id_categories_id_fk",
		}),
		commandsCategoryIdIdx: createIndex("commands_category_id_idx").on(table.categoryId),
	  };
	}
  );
  
  export const tags = pgTable(
	"tags",
	{
	  id: text().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	  name: text().notNull(),
	},
	(table) => {
	  return {
		tagsNameUnique: unique("tags_name_unique").on(sql`lower(${table.name})`),
	  };
	}
  );
  
  export const userCommands = pgTable(
	"user_commands",
	{
	  id: text().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	  userId: text("user_id").notNull(),
	  commandId: text("command_id").notNull(),
	  isFavorite: boolean("is_favorite").default(false).notNull(),
	},
	(table) => {
	  return {
		userCommandUnique: uniqueIndex("user_command_unique").using("btree", table.userId.asc(), table.commandId.asc()),
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
  
  export const userProfiles = pgTable(
	"user_profiles",
	{
	  id: text().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	  isActive: boolean("is_active").default(true).notNull(),
	  username: text("username").notNull(),
	  avatarUrl: text("avatar_url"),
	},
	(table) => {
	  return {
		usernameUnique: unique("user_profiles_username_unique")
	  };
	}
  );
  
  export const commandTags = pgTable(
	"command_tags",
	{
	  commandId: text("command_id").notNull(),
	  tagId: text("tag_id").notNull(),
	},
	(table) => {
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
  
  export const processes = pgTable(
	"processes",
	{
	  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
	  title: text("title").notNull(),
	  userId: text("user_id").notNull().references(() => userProfiles.id),
	}
  );
  
  export const processSteps = pgTable(
	"process_steps",
	{
	  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
	  processId: text("process_id").notNull().references(() => processes.id),
	  title: text("title").notNull(),
	  stepExplanation: text("description").notNull(),
	  code_block: text("code_block"),
	  order: integer("order").notNull()
	},
	(table) => {
	  return {
		processStepsProcessIdOrderUnique: uniqueIndex("process_steps_process_id_order_unique").on(
		  table.processId,
		  table.order
		),
	  };
	}
  );
  