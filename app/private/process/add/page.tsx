"use client";

import { ProcessForm } from "@/components/process/ProcessForm";

export default function ProcessPage() {
	return (
		<ProcessForm
			mode='add'
			backUrl='/private/process'
		/>
	);
}
