"use client";

import { LoginPrompt } from "../components/LoginPrompt";
import ProcessPageContent from "./components/ProcessPageContent";

export default function PublicProcessPage() {
	return (
		<div>
			<LoginPrompt type="process" />
			<ProcessPageContent privacy="public" />
		</div>
	);
}
