
-- Stage 1: Organization Improvements
-- Tags, Collections, and Related Commands

-- Tags table
CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "color" "text" DEFAULT '#6366f1',
    "user_id" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Command tags junction table
CREATE TABLE IF NOT EXISTS "public"."command_tags" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "command_id" "text" NOT NULL,
    "tag_id" "text" NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("command_id") REFERENCES "public"."commands"("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Unique constraint on command_tags
CREATE UNIQUE INDEX IF NOT EXISTS "command_tag_unique" ON "public"."command_tags" USING "btree" ("command_id", "tag_id");

-- Collections table
CREATE TABLE IF NOT EXISTS "public"."collections" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "user_id" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Collection commands junction table
CREATE TABLE IF NOT EXISTS "public"."collection_commands" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "collection_id" "text" NOT NULL,
    "command_id" "text" NOT NULL,
    "order" integer DEFAULT 0,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("command_id") REFERENCES "public"."commands"("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Unique constraint on collection_commands
CREATE UNIQUE INDEX IF NOT EXISTS "collection_command_unique" ON "public"."collection_commands" USING "btree" ("collection_id", "command_id");

-- Collection processes junction table
CREATE TABLE IF NOT EXISTS "public"."collection_processes" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "collection_id" "text" NOT NULL,
    "process_id" "text" NOT NULL,
    "order" integer DEFAULT 0,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("process_id") REFERENCES "public"."processes"("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Unique constraint on collection_processes
CREATE UNIQUE INDEX IF NOT EXISTS "collection_process_unique" ON "public"."collection_processes" USING "btree" ("collection_id", "process_id");

-- Command links table for related commands
CREATE TABLE IF NOT EXISTS "public"."command_links" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "command_id" "text" NOT NULL,
    "related_command_id" "text" NOT NULL,
    "relationship_type" "text" DEFAULT 'related',
    PRIMARY KEY ("id"),
    FOREIGN KEY ("command_id") REFERENCES "public"."commands"("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("related_command_id") REFERENCES "public"."commands"("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Unique constraint on command_links
CREATE UNIQUE INDEX IF NOT EXISTS "command_link_unique" ON "public"."command_links" USING "btree" ("command_id", "related_command_id");

-- Grant permissions
GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";

GRANT ALL ON TABLE "public"."command_tags" TO "anon";
GRANT ALL ON TABLE "public"."command_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."command_tags" TO "service_role";

GRANT ALL ON TABLE "public"."collections" TO "anon";
GRANT ALL ON TABLE "public"."collections" TO "authenticated";
GRANT ALL ON TABLE "public"."collections" TO "service_role";

GRANT ALL ON TABLE "public"."collection_commands" TO "anon";
GRANT ALL ON TABLE "public"."collection_commands" TO "authenticated";
GRANT ALL ON TABLE "public"."collection_commands" TO "service_role";

GRANT ALL ON TABLE "public"."collection_processes" TO "anon";
GRANT ALL ON TABLE "public"."collection_processes" TO "authenticated";
GRANT ALL ON TABLE "public"."collection_processes" TO "service_role";

GRANT ALL ON TABLE "public"."command_links" TO "anon";
GRANT ALL ON TABLE "public"."command_links" TO "authenticated";
GRANT ALL ON TABLE "public"."command_links" TO "service_role";