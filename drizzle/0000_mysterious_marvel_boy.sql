CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "command_tags" (
	"command_id" text NOT NULL,
	"tag_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "command_tags_command_id_tag_id_pk" PRIMARY KEY("command_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "commands" (
	"id" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"usage" text NOT NULL,
	"category_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_commands" (
	"id" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" text NOT NULL,
	"command_id" text NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"notes" text,
	"last_used" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_email_unique" UNIQUE("email"),
	CONSTRAINT "user_profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "command_tags" ADD CONSTRAINT "command_tags_command_id_commands_id_fk" FOREIGN KEY ("command_id") REFERENCES "public"."commands"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "command_tags" ADD CONSTRAINT "command_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commands" ADD CONSTRAINT "commands_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_commands" ADD CONSTRAINT "user_commands_user_id_user_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_commands" ADD CONSTRAINT "user_commands_command_id_commands_id_fk" FOREIGN KEY ("command_id") REFERENCES "public"."commands"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_command_unique" ON "user_commands" USING btree ("user_id","command_id");