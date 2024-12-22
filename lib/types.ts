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
export type ProcessWithSteps = Process & {
  steps: ProcessStep[];
};

// commands
// DTO for creating a new command
export type CreateCommand = Partial<Command>;

// DTO for updating an existing command
export type UpdateCommand = Partial<Command>;

// DTO for command response
export type GetCommand = Command & {
  category: Category | null;
}

// categories