ALTER TABLE "commands" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();--> statement-breakpoint
ALTER TABLE "user_commands" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();