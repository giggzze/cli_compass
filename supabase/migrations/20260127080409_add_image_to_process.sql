-- Add image column to process_steps table
ALTER TABLE "public"."process_steps" ADD COLUMN IF NOT EXISTS "image" "text";
