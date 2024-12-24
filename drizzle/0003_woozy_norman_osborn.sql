ALTER TABLE "command_tags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "command_tags" CASCADE;--> statement-breakpoint
DROP TABLE "tags" CASCADE;--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME TO "profiles";--> statement-breakpoint
ALTER TABLE "commands" RENAME COLUMN "is_private" TO "visibility";--> statement-breakpoint
ALTER TABLE "process_steps" RENAME COLUMN "description" TO "stepExplanation";--> statement-breakpoint
ALTER TABLE "process_steps" RENAME COLUMN "code_block" TO "code";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_name_unique";--> statement-breakpoint
ALTER TABLE "commands" DROP CONSTRAINT "commands_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "process_steps" DROP CONSTRAINT "process_steps_process_id_processes_id_fk";
--> statement-breakpoint
ALTER TABLE "processes" DROP CONSTRAINT "processes_user_id_user_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "user_commands" DROP CONSTRAINT "user_commands_command_id_commands_id_fk";
--> statement-breakpoint
ALTER TABLE "user_commands" DROP CONSTRAINT "user_commands_user_id_user_profiles_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "user_command_unique";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "commands" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "commands" ALTER COLUMN "code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "commands" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "process_steps" ALTER COLUMN "process_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "process_steps" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "process_steps" ALTER COLUMN "order" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "processes" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "processes" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_commands" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_commands" ALTER COLUMN "command_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_commands" ALTER COLUMN "is_favorite" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN IF EXISTS "is_active";