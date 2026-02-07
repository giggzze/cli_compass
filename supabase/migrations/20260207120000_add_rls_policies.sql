-- RLS: All users can view and create; only creator can edit/delete (commands & processes).
-- Commands need a creator column; processes already have user_id.

-- 1. Add user_id to commands (nullable for existing rows)
ALTER TABLE "public"."commands"
  ADD COLUMN IF NOT EXISTS "user_id" "text" REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;

-- 2. Enable RLS on all public tables (categories already has it enabled)
ALTER TABLE "public"."commands" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."process_steps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."processes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_commands" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."command_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."collections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."collection_commands" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."collection_processes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."command_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."command_usage" ENABLE ROW LEVEL SECURITY;

-- 3. Categories: all can view and create; all can edit/delete (shared reference)
DROP POLICY IF EXISTS "categories_select" ON "public"."categories";
CREATE POLICY "categories_select" ON "public"."categories" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "categories_insert" ON "public"."categories";
CREATE POLICY "categories_insert" ON "public"."categories" FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "categories_update" ON "public"."categories";
CREATE POLICY "categories_update" ON "public"."categories" FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "categories_delete" ON "public"."categories";
CREATE POLICY "categories_delete" ON "public"."categories" FOR DELETE TO authenticated USING (true);

-- 4. Commands: all can view and create; only creator can edit/delete
DROP POLICY IF EXISTS "commands_select" ON "public"."commands";
CREATE POLICY "commands_select" ON "public"."commands" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "commands_insert" ON "public"."commands";
CREATE POLICY "commands_insert" ON "public"."commands" FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "commands_update" ON "public"."commands";
CREATE POLICY "commands_update" ON "public"."commands" FOR UPDATE TO authenticated
  USING ("user_id" = auth.uid()::text);
DROP POLICY IF EXISTS "commands_delete" ON "public"."commands";
CREATE POLICY "commands_delete" ON "public"."commands" FOR DELETE TO authenticated
  USING ("user_id" = auth.uid()::text);

-- 5. Processes: all can view and create; only creator can edit/delete
DROP POLICY IF EXISTS "processes_select" ON "public"."processes";
CREATE POLICY "processes_select" ON "public"."processes" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "processes_insert" ON "public"."processes";
CREATE POLICY "processes_insert" ON "public"."processes" FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "processes_update" ON "public"."processes";
CREATE POLICY "processes_update" ON "public"."processes" FOR UPDATE TO authenticated
  USING ("user_id" = auth.uid()::text);
DROP POLICY IF EXISTS "processes_delete" ON "public"."processes";
CREATE POLICY "processes_delete" ON "public"."processes" FOR DELETE TO authenticated
  USING ("user_id" = auth.uid()::text);

-- 6. Process_steps: all can view; only process owner can insert/update/delete
DROP POLICY IF EXISTS "process_steps_select" ON "public"."process_steps";
CREATE POLICY "process_steps_select" ON "public"."process_steps" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "process_steps_insert" ON "public"."process_steps";
CREATE POLICY "process_steps_insert" ON "public"."process_steps" FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM "public"."processes" p WHERE p.id = process_id AND p.user_id = auth.uid()::text)
  );
DROP POLICY IF EXISTS "process_steps_update" ON "public"."process_steps";
CREATE POLICY "process_steps_update" ON "public"."process_steps" FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "public"."processes" p WHERE p.id = process_id AND p.user_id = auth.uid()::text)
  );
DROP POLICY IF EXISTS "process_steps_delete" ON "public"."process_steps";
CREATE POLICY "process_steps_delete" ON "public"."process_steps" FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "public"."processes" p WHERE p.id = process_id AND p.user_id = auth.uid()::text)
  );

-- 7. Profiles: all can view; users can insert/update/delete own profile
DROP POLICY IF EXISTS "profiles_select" ON "public"."profiles";
CREATE POLICY "profiles_select" ON "public"."profiles" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "profiles_insert" ON "public"."profiles";
CREATE POLICY "profiles_insert" ON "public"."profiles" FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid()::text);
DROP POLICY IF EXISTS "profiles_update" ON "public"."profiles";
CREATE POLICY "profiles_update" ON "public"."profiles" FOR UPDATE TO authenticated
  USING (id = auth.uid()::text) WITH CHECK (id = auth.uid()::text);
DROP POLICY IF EXISTS "profiles_delete" ON "public"."profiles";
CREATE POLICY "profiles_delete" ON "public"."profiles" FOR DELETE TO authenticated
  USING (id = auth.uid()::text);

-- 8. User_commands: all can view and create; only owner can edit/delete
DROP POLICY IF EXISTS "user_commands_select" ON "public"."user_commands";
CREATE POLICY "user_commands_select" ON "public"."user_commands" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "user_commands_insert" ON "public"."user_commands";
CREATE POLICY "user_commands_insert" ON "public"."user_commands" FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "user_commands_update" ON "public"."user_commands";
CREATE POLICY "user_commands_update" ON "public"."user_commands" FOR UPDATE TO authenticated
  USING ("user_id" = auth.uid()::text);
DROP POLICY IF EXISTS "user_commands_delete" ON "public"."user_commands";
CREATE POLICY "user_commands_delete" ON "public"."user_commands" FOR DELETE TO authenticated
  USING ("user_id" = auth.uid()::text);

-- 9. Tags: all can view and create; only owner can edit/delete
DROP POLICY IF EXISTS "tags_select" ON "public"."tags";
CREATE POLICY "tags_select" ON "public"."tags" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "tags_insert" ON "public"."tags";
CREATE POLICY "tags_insert" ON "public"."tags" FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "tags_update" ON "public"."tags";
CREATE POLICY "tags_update" ON "public"."tags" FOR UPDATE TO authenticated
  USING ("user_id" = auth.uid()::text);
DROP POLICY IF EXISTS "tags_delete" ON "public"."tags";
CREATE POLICY "tags_delete" ON "public"."tags" FOR DELETE TO authenticated
  USING ("user_id" = auth.uid()::text);

-- 10. Command_tags: all can view; insert/delete when user owns the command or the tag
DROP POLICY IF EXISTS "command_tags_select" ON "public"."command_tags";
CREATE POLICY "command_tags_select" ON "public"."command_tags" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "command_tags_insert" ON "public"."command_tags";
CREATE POLICY "command_tags_insert" ON "public"."command_tags" FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM "public"."commands" c WHERE c.id = command_id AND c.user_id = auth.uid()::text)
    OR EXISTS (SELECT 1 FROM "public"."tags" t WHERE t.id = tag_id AND t.user_id = auth.uid()::text)
  );
DROP POLICY IF EXISTS "command_tags_update" ON "public"."command_tags";
CREATE POLICY "command_tags_update" ON "public"."command_tags" FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "public"."commands" c WHERE c.id = command_id AND c.user_id = auth.uid()::text)
    OR EXISTS (SELECT 1 FROM "public"."tags" t WHERE t.id = tag_id AND t.user_id = auth.uid()::text)
  );
DROP POLICY IF EXISTS "command_tags_delete" ON "public"."command_tags";
CREATE POLICY "command_tags_delete" ON "public"."command_tags" FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "public"."commands" c WHERE c.id = command_id AND c.user_id = auth.uid()::text)
    OR EXISTS (SELECT 1 FROM "public"."tags" t WHERE t.id = tag_id AND t.user_id = auth.uid()::text)
  );

-- 11. Collections: all can view and create; only owner can edit/delete
DROP POLICY IF EXISTS "collections_select" ON "public"."collections";
CREATE POLICY "collections_select" ON "public"."collections" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "collections_insert" ON "public"."collections";
CREATE POLICY "collections_insert" ON "public"."collections" FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "collections_update" ON "public"."collections";
CREATE POLICY "collections_update" ON "public"."collections" FOR UPDATE TO authenticated
  USING ("user_id" = auth.uid()::text);
DROP POLICY IF EXISTS "collections_delete" ON "public"."collections";
CREATE POLICY "collections_delete" ON "public"."collections" FOR DELETE TO authenticated
  USING ("user_id" = auth.uid()::text);

-- 12. Collection_commands: all can view; only collection owner can insert/update/delete
DROP POLICY IF EXISTS "collection_commands_select" ON "public"."collection_commands";
CREATE POLICY "collection_commands_select" ON "public"."collection_commands" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "collection_commands_insert" ON "public"."collection_commands";
CREATE POLICY "collection_commands_insert" ON "public"."collection_commands" FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM "public"."collections" c WHERE c.id = collection_id AND c.user_id = auth.uid()::text)
  );
DROP POLICY IF EXISTS "collection_commands_update" ON "public"."collection_commands";
CREATE POLICY "collection_commands_update" ON "public"."collection_commands" FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "public"."collections" c WHERE c.id = collection_id AND c.user_id = auth.uid()::text)
  );
DROP POLICY IF EXISTS "collection_commands_delete" ON "public"."collection_commands";
CREATE POLICY "collection_commands_delete" ON "public"."collection_commands" FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "public"."collections" c WHERE c.id = collection_id AND c.user_id = auth.uid()::text)
  );

-- 13. Collection_processes: all can view; only collection owner can insert/update/delete
DROP POLICY IF EXISTS "collection_processes_select" ON "public"."collection_processes";
CREATE POLICY "collection_processes_select" ON "public"."collection_processes" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "collection_processes_insert" ON "public"."collection_processes";
CREATE POLICY "collection_processes_insert" ON "public"."collection_processes" FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM "public"."collections" c WHERE c.id = collection_id AND c.user_id = auth.uid()::text)
  );
DROP POLICY IF EXISTS "collection_processes_update" ON "public"."collection_processes";
CREATE POLICY "collection_processes_update" ON "public"."collection_processes" FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "public"."collections" c WHERE c.id = collection_id AND c.user_id = auth.uid()::text)
  );
DROP POLICY IF EXISTS "collection_processes_delete" ON "public"."collection_processes";
CREATE POLICY "collection_processes_delete" ON "public"."collection_processes" FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "public"."collections" c WHERE c.id = collection_id AND c.user_id = auth.uid()::text)
  );

-- 14. Command_links: all can view; only command owner can insert/update/delete
DROP POLICY IF EXISTS "command_links_select" ON "public"."command_links";
CREATE POLICY "command_links_select" ON "public"."command_links" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "command_links_insert" ON "public"."command_links";
CREATE POLICY "command_links_insert" ON "public"."command_links" FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM "public"."commands" c WHERE c.id = command_id AND c.user_id = auth.uid()::text)
  );
DROP POLICY IF EXISTS "command_links_update" ON "public"."command_links";
CREATE POLICY "command_links_update" ON "public"."command_links" FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "public"."commands" c WHERE c.id = command_id AND c.user_id = auth.uid()::text)
  );
DROP POLICY IF EXISTS "command_links_delete" ON "public"."command_links";
CREATE POLICY "command_links_delete" ON "public"."command_links" FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "public"."commands" c WHERE c.id = command_id AND c.user_id = auth.uid()::text)
  );

-- 15. Command_usage: all can view and create; only owner can edit/delete
DROP POLICY IF EXISTS "command_usage_select" ON "public"."command_usage";
CREATE POLICY "command_usage_select" ON "public"."command_usage" FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "command_usage_insert" ON "public"."command_usage";
CREATE POLICY "command_usage_insert" ON "public"."command_usage" FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "command_usage_update" ON "public"."command_usage";
CREATE POLICY "command_usage_update" ON "public"."command_usage" FOR UPDATE TO authenticated
  USING ("user_id" = auth.uid()::text);
DROP POLICY IF EXISTS "command_usage_delete" ON "public"."command_usage";
CREATE POLICY "command_usage_delete" ON "public"."command_usage" FOR DELETE TO authenticated
  USING ("user_id" = auth.uid()::text);
