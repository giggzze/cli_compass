import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import * as schema from "./schema";

// Make sure to create a .env.local file with these variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// Connection string will be like: postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}

// For migrations and queries
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
