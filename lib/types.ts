import {
    categories,
    commands,
    tags,
    userCommands,
    commandTags,
    processes,
    processSteps,
} from "@/db/schema";

// types from the database
export type Category = typeof categories.$inferSelect;
export type Command = typeof commands.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type UserCommand = typeof userCommands.$inferSelect;
export type CommandTag = typeof commandTags.$inferSelect;
export type Process = typeof processes.$inferSelect;
export type ProcessStep = typeof processSteps.$inferSelect;

// process
export interface ProcessWithSteps extends Process {
  steps: ProcessStep[];
};

// commands
export interface CreateCommandDTO {
  description: string;
  code: string;
  isPrivate: boolean;
  categoryId: string;
}

export interface UpdateCommandDTO {
  description?: string;
  code?: string;
  isPrivate?: boolean;
  categoryId?: string;
}

export interface GetCommandDTO extends Command {
  category: Category | null;
  isFavorite?: boolean;
  lastUsed?: string;
}

// forms
export interface CommandFormData {
  code : string;
  category_id: string;
  customCategory: string;
  is_private: boolean;
}

export interface CategoryFormData {
  name: string;
}

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}