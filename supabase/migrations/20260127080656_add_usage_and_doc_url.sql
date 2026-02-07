
-- Stage 5: Data Management - Usage tracking and documentation links

-- Add doc_url and language to commands
ALTER TABLE "public"."commands" ADD COLUMN IF NOT EXISTS "doc_url" "text";
ALTER TABLE "public"."commands" ADD COLUMN IF NOT EXISTS "language" "text";

-- Add language to process_steps
ALTER TABLE "public"."process_steps" ADD COLUMN IF NOT EXISTS "language" "text";

-- Command usage tracking table
CREATE TABLE IF NOT EXISTS "public"."command_usage" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "command_id" "text" NOT NULL,
    "user_id" "text" NOT NULL,
    "action" "text" NOT NULL,
    "timestamp" timestamp without time zone DEFAULT "now"() NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("command_id") REFERENCES "public"."commands"("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Index for faster usage queries
CREATE INDEX IF NOT EXISTS "command_usage_command_id_idx" ON "public"."command_usage" ("command_id");
CREATE INDEX IF NOT EXISTS "command_usage_user_id_idx" ON "public"."command_usage" ("user_id");
CREATE INDEX IF NOT EXISTS "command_usage_timestamp_idx" ON "public"."command_usage" ("timestamp");

-- Grant permissions
GRANT ALL ON TABLE "public"."command_usage" TO "anon";
GRANT ALL ON TABLE "public"."command_usage" TO "authenticated";
GRANT ALL ON TABLE "public"."command_usage" TO "service_role";