"use client";

import { LoginPrompt } from "../components/LoginPrompt";
import CommandsPageContent from "./components/CommandsPageContent";

export default function PublicCommandsPage() {
  return (
    <div>
      <LoginPrompt />
      <CommandsPageContent commandsEndpoint="/api/commands" />
    </div>
  );
}
