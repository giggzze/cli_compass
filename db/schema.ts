// import { pgTable, text, boolean, integer } from "drizzle-orm/pg-core";
// import { sql } from "drizzle-orm";

// export const categories = pgTable("categories", {
//   id: text("id")
//     .default(sql`uuid_generate_v4()`)
//     .primaryKey()
//     .notNull(),
//   name: text("name"),
// });

// export const commands = pgTable("commands", {
//   id: text("id")
//     .default(sql`uuid_generate_v4()`)
//     .primaryKey()
//     .notNull(),
//   description: text("description"),
//   code: text("code"),
//   categoryId: text("category_id"),
//   docUrl: text("doc_url"),
//   language: text("language"),
//   isPrivate: boolean("is_private").default(true),
//   createdAt: text("created_at").default(sql`now()`),
// });

// export const userCommands = pgTable("user_commands", {
//   id: text("id")
//     .default(sql`uuid_generate_v4()`)
//     .primaryKey()
//     .notNull(),
//   userId: text("user_id"),
//   commandId: text("command_id"),
//   isFavorite: boolean("is_favorite").default(false),
// });

// export const profiles = pgTable("profiles", {
//   id: text("id")
//     .default(sql`uuid_generate_v4()`)
//     .primaryKey()
//     .notNull(),
//   username: text("username"),
//   avatarUrl: text("avatar_url"),
// });

// export const processes = pgTable("processes", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`uuid_generate_v4()`),
//   title: text("title"),
//   userId: text("user_id"),
//   createdAt: text("created_at").default(sql`now()`),
//   isPrivate: boolean("is_private").default(true),
// });

// export const processSteps = pgTable("process_steps", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`uuid_generate_v4()`),
//   processId: text("process_id"),
//   stepExplanation: text("stepExplanation"),
//   code: text("code"),
//   image: text("image"),
//   language: text("language"),
//   order: integer("order"),
// });

// // Tags system
// export const tags = pgTable("tags", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`uuid_generate_v4()`),
//   name: text("name").notNull(),
//   color: text("color").default("#6366f1"),
//   userId: text("user_id").notNull(),
//   createdAt: text("created_at").default(sql`now()`),
// });

// export const commandTags = pgTable("command_tags", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`uuid_generate_v4()`),
//   commandId: text("command_id").notNull(),
//   tagId: text("tag_id").notNull(),
// });

// // Collections system
// export const collections = pgTable("collections", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`uuid_generate_v4()`),
//   name: text("name").notNull(),
//   description: text("description"),
//   userId: text("user_id").notNull(),
//   createdAt: text("created_at").default(sql`now()`),
// });

// export const collectionCommands = pgTable("collection_commands", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`uuid_generate_v4()`),
//   collectionId: text("collection_id").notNull(),
//   commandId: text("command_id").notNull(),
//   order: integer("order").default(0),
// });

// export const collectionProcesses = pgTable("collection_processes", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`uuid_generate_v4()`),
//   collectionId: text("collection_id").notNull(),
//   processId: text("process_id").notNull(),
//   order: integer("order").default(0),
// });

// // Related commands linking
// export const commandLinks = pgTable("command_links", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`uuid_generate_v4()`),
//   commandId: text("command_id").notNull(),
//   relatedCommandId: text("related_command_id").notNull(),
//   relationshipType: text("relationship_type").default("related"),
// });

// // Usage tracking
// export const commandUsage = pgTable("command_usage", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`uuid_generate_v4()`),
//   commandId: text("command_id").notNull(),
//   userId: text("user_id").notNull(),
//   action: text("action").notNull(), // 'copy', 'view'
//   timestamp: text("timestamp").default(sql`now()`),
// });
