ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_email_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_command_unique";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_command_unique" ON "user_commands" USING btree ("user_id","command_id");--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "username";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "full_name";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "avatar_url";