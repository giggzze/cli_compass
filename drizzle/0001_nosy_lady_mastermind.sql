ALTER TABLE "commands" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "commands" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "commands" ADD COLUMN "is_private" boolean DEFAULT true NOT NULL;