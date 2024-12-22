"use client";

import CommandsPageContent from "../components/CommandsPageContent";
import { LoginPrompt } from "../components/LoginPrompt";

export default function CommandsPage() {
  return (
    <div>
      <LoginPrompt />
      <CommandsPageContent commandsEndpoint="/api/commands" />
    </div>
  );
}
