"use client";

import CommandsPageContent from "@/components/command/CommandsPageContent";

export default function UserCommandsPage() {
  return (
    <CommandsPageContent
      commandsEndpoint="/api/commands/user"
      shouldFetchUserId={true}
    />
  );
}
