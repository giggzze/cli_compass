"use client";

import CommandsPageContent from "@/components/command/CommandsPageContent";
import { LoginPrompt } from "@/components/shared/LoginPrompt";

export default function PublicCommandsPage() {
  return (
    <div>
      <LoginPrompt />
      <CommandsPageContent commandsEndpoint="/api/commands" />
    </div>
  );
}
