ALTER TABLE "commands" ADD COLUMN "created_at" text DEFAULT now();--> statement-breakpoint
ALTER TABLE "processes" ADD COLUMN "created_at" text DEFAULT now();--> statement-breakpoint
ALTER TABLE "process_steps" DROP COLUMN IF EXISTS "title";