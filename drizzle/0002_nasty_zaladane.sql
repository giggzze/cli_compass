ALTER TABLE "commands" RENAME COLUMN "usage" TO "code";--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "command_tags" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "command_tags" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "commands" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "commands" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "commands" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "process_steps" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "process_steps" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "processes" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "processes" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "tags" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "tags" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "user_commands" DROP COLUMN IF EXISTS "notes";--> statement-breakpoint
ALTER TABLE "user_commands" DROP COLUMN IF EXISTS "last_used";--> statement-breakpoint
ALTER TABLE "user_commands" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "user_commands" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "updated_at";