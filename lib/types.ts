import {
  //   categories,
  //   commands,
  //   tags,
  //   userCommands,
  //   commandTags,
  processes,
  processSteps,
} from "@/db/schema";

// export type Category = typeof categories.$inferSelect;
// export type Command = typeof commands.$inferSelect;
// export type Tag = typeof tags.$inferSelect;
// export type UserCommand = typeof userCommands.$inferSelect;
// export type UserProfile = typeof userProfiles.$inferSelect;
// export type CommandTag = typeof commandTags.$inferSelect;
export type Process = typeof processes.$inferSelect;
export type ProcessStep = typeof processSteps.$inferSelect;

export type ProcessWithSteps = Process & {
  steps: ProcessStep[];
};
