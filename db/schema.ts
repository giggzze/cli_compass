import { pgTable, serial, text, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';


export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const commands = pgTable('commands', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  usage: text('usage').notNull(),
  category_id: integer('category_id').references(() => categories.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const commandTags = pgTable('command_tags', {
  command_id: integer('command_id').references(() => commands.id).notNull(),
  tag_id: integer('tag_id').references(() => tags.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey(table.command_id, table.tag_id),
}));

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  command_id: integer('command_id').references(() => commands.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
