alter table "public"."user_profiles" drop constraint "user_profiles_email_unique";

drop index if exists "public"."user_profiles_email_unique";

alter table "public"."user_profiles" drop column "avatar_url";

alter table "public"."user_profiles" drop column "email";

alter table "public"."user_profiles" drop column "full_name";

alter table "public"."user_profiles" drop column "username";


