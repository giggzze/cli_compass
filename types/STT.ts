import { Tables, TablesInsert, TablesUpdate } from "./supabase";

export type Category = Tables<"categories">;
export type Command = Tables<"commands">;
export type ProcessStep = Tables<"process_steps">;
export type Process = Tables<"processes">;
export type Tag = Tables<"tags">;
export type UserCommand = Tables<"user_commands">;
export type CollectionCommand = Tables<"collection_commands">;
export type CollectionProcess = Tables<"collection_processes">;
export type CommandLink = Tables<"command_links">;
export type CommandTag = Tables<"command_tags">;
export type CommandUsage = Tables<"command_usage">;
export type Collection = Tables<"collections">;
export type Profile = Tables<"profiles">;

// update types
export type CategoryUpdate = TablesUpdate<"categories">;
export type CommandUpdate = TablesUpdate<"commands">;
export type ProcessStepUpdate = TablesUpdate<"process_steps">;
export type ProcessUpdate = TablesUpdate<"processes">;
export type TagUpdate = TablesUpdate<"tags">;
export type UserCommandUpdate = TablesUpdate<"user_commands">;
export type CollectionCommandUpdate = TablesUpdate<"collection_commands">;
export type CollectionProcessUpdate = TablesUpdate<"collection_processes">;
export type CommandLinkUpdate = TablesUpdate<"command_links">;
export type CommandTagUpdate = TablesUpdate<"command_tags">;
export type CommandUsageUpdate = TablesUpdate<"command_usage">;
export type CollectionUpdate = TablesUpdate<"collections">;
export type ProfileUpdate = TablesUpdate<"profiles">;

// insert types
export type CategoryInsert = TablesInsert<"categories">;
export type CommandInsert = TablesInsert<"commands">;
export type ProcessStepInsert = TablesInsert<"process_steps">;
export type ProcessInsert = TablesInsert<"processes">;
export type TagInsert = TablesInsert<"tags">;
export type UserCommandInsert = TablesInsert<"user_commands">;
export type CollectionCommandInsert = TablesInsert<"collection_commands">;
export type CollectionProcessInsert = TablesInsert<"collection_processes">;
export type CommandLinkInsert = TablesInsert<"command_links">;
export type CommandTagInsert = TablesInsert<"command_tags">;
export type CommandUsageInsert = TablesInsert<"command_usage">;
export type ProfileInsert = TablesInsert<"profiles">;
export type CollectionInsert = TablesInsert<"collections">;

export type UserCommandCombined = Command & UserCommand & Profile;
export type UserCommandCombinedWithCategory = Command &
  UserCommand &
  Profile &
  Category;
export type PublicCommand = Command & Category;

// Service-specific types
export interface IProcessStep {
  stepExplanation: string;
  code?: string | null;
  image?: string | null;
  order?: number;
}

export type IGetProcessWithStep = Process & {
  steps: ProcessStep[];
  user?: Profile | null;
};

export type ILinkedCommand = Pick<
  Command,
  "id" | "description" | "code" | "category_id"
> & {
  relationship_type: string | null;
  category?: Pick<Category, "id" | "name"> | null;
  categories?: Pick<Category, "id" | "name"> | null;
};

export interface ICommandUsageStats {
  command_id: string;
  description: string | null;
  code: string | null;
  category_name: string | null;
  copy_count: number;
  view_count: number;
  total_count: number;
  last_used: string | null;
}

export type CommandListItem = Command & {
  category?: Pick<Category, "id" | "name"> | null;
  user?: { id: string; avatarUrl?: string | null; username?: string | null } | null;
  isFavorite?: boolean;
};

export type CollectionWithItems = Collection & {
  commands: (Pick<Command, "id" | "description" | "code" | "is_private" | "category_id" | "created_at"> & {
    order: number | null;
    category?: Pick<Category, "id" | "name"> | null;
  })[];
  processes: (Pick<Process, "id" | "title" | "user_id" | "is_private" | "created_at"> & {
    order: number | null;
  })[];
};
