import { profiles } from "@/db/schema";

export type IProfile = typeof profiles.$inferSelect;