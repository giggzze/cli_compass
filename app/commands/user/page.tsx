"use client";

import CommandsPageContent from "../components/CommandsPageContent";

export default function UserCommandsPage() {
  return (
    <CommandsPageContent
      commandsEndpoint="/api/commands/user"
      shouldFetchUserId={true}
    />
  );
}
