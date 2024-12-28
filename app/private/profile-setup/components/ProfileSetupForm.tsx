"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserImage } from "@/hooks/useUserImage";

interface ProfileSetupFormProps {
	userId: string;
}

export default function ProfileSetupForm({ userId }: ProfileSetupFormProps) {
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const userImageUrl = useUserImage();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/profile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					userId,
					userImageUrl,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to create profile");
			}

			router.replace("/private/command");
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8'>
				<div className='flex flex-col items-center'>
					<div className='mb-4 relative w-16 h-16 rounded-full overflow-hidden'>
						{userImageUrl && (
							<Image
								src={userImageUrl}
								alt='User avatar'
								fill
								className='object-cover'
								priority
							/>
						)}
					</div>
					<h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
						Set up your profile
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						Choose a username to get started
					</p>
				</div>
				<form
					className='mt-8 space-y-6'
					onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor='username'
							className='sr-only'>
							Username
						</label>
						<input
							id='username'
							name='username'
							type='text'
							required
							className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
							placeholder='Username'
							value={username}
							onChange={e => setUsername(e.target.value)}
							disabled={isLoading}
						/>
					</div>

					{error && (
						<div className='rounded-md bg-red-50 p-4'>
							<div className='flex'>
								<div className='ml-3'>
									<h3 className='text-sm font-medium text-red-800'>
										{error}
									</h3>
								</div>
							</div>
						</div>
					)}

					<div>
						<button
							type='submit'
							disabled={isLoading}
							className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50'>
							{isLoading ? "Setting up..." : "Continue"}
						</button>
					</div>
				</form>
				<p className='mt-4 text-xs text-gray-500 text-center'>
					We only store your chosen username, which will be publicly
					visible if you share a command or process. All other login
					information is securely managed by Clerk and not stored by
					us.
				</p>
				<p className='bg-yellow-50 text-yellow-800 p-4 rounded-md border border-yellow-200 mt-4'>
					If submitting your username doesn't redirect you, please
					refresh the page manually.
				</p>
			</div>
		</div>
	);
}
