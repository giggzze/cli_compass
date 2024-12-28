"use client";

import CommandsPageContent from "@/components/command/CommandsPageContent";
import Loading from "@/components/shared/Loading";

export default function UserCommandsPage() {
	return (
		<CommandsPageContent
			commandsEndpoint='/api/commands/user'
			shouldFetchUserId={true}
		/>
	);
}
