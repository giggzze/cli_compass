"use client";

import { LoginPrompt } from "../components/LoginPrompt";
import ProcessPageContent from "./components/ProcessPageContent";

export default function ProcessPage() {
	return (
		<div>
			<LoginPrompt type="process" />
			<ProcessPageContent processesEndpoint='/api/processes' />
		</div>
	);
}
