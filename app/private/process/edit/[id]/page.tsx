"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProcessForm } from "@/components/process/ProcessForm";
import { IProcessStep } from "@/app/models/Process";
import Loading from "@/components/shared/Loading";

export default function EditProcessPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [initialData, setInitialData] = useState<{
		title: string;
		steps: IProcessStep[];
	} | null>(null);

	useEffect(() => {
		const fetchProcess = async () => {
			try {
				const response = await fetch(
					`/api/processes/private/${params.id}`
				);
				const data = await response.json();

				if (data.success) {
					setInitialData({
						title: data.data[0].title,
						steps: data.data[0].steps,
					});
				} else {
					console.error("Failed to fetch process:", data.error);
					alert("Failed to fetch process. Please try again.");
					router.push("/private/process");
				}
			} catch (error) {
				console.error("Error fetching process:", error);
				alert("An error occurred. Please try again.");
				router.push("/private/process");
			} finally {
				setIsLoading(false);
			}
		};

		fetchProcess();
	}, [params.id, router]);

	if (isLoading) {
		return (
			<div className='container mx-auto p-4 max-w-4xl'>
				<Loading
					size='large'
					color='text-blue-600'
				/>
			</div>
		);
	}

	return initialData ? (
		<ProcessForm
			mode='edit'
			processId={params.id}
			initialData={initialData}
			backUrl='/private/process'
		/>
	) : null;
}
