"use client";

import CommandsPageContent from "../components/CommandsPageContent";
import { LoginPrompt } from "../components/LoginPrompt";

export default function PublicCommandsPage() {
	return (
		<div>
			<LoginPrompt />
			<CommandsPageContent commandsEndpoint='/api/commands' />
		</div>
	);
}
