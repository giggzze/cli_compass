import { GetCommandAndUserDTO } from "@/lib/db.types";
import { useState } from "react";
import Image from "next/image";
import Loading from "@/app/components/Loading";

interface CommandListProps {
	commands: GetCommandAndUserDTO[];
	isLoading: boolean;
	showFavoritesToggle: boolean;
	showFavoritesOnly: boolean;
	onFavoritesToggle: () => void;
	onToggleFavorite: (commandId: string) => void;
}

export default function CommandList({
	commands,
	isLoading,
	onToggleFavorite,
}: CommandListProps) {
	const [copiedCode, setCopiedCode] = useState<string | null>(null);

	const copyToClipboard = async (text: string, event: React.MouseEvent) => {
		// Don't copy if clicking on the favorite button
		if ((event.target as HTMLElement).closest(".favorite-button")) {
			return;
		}
		try {
			await navigator.clipboard.writeText(text);
			setCopiedCode(text);
			setTimeout(() => setCopiedCode(null), 2000);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	return (
		<div className='grid gap-4'>
			{isLoading ? (
				<div className="flex justify-center items-center min-h-[200px]">
					<Loading size="large" color="text-blue-600" />
				</div>
			) : (
				<>
					{commands.length === 0 ? (
						<div className='bg-white p-6 rounded-lg shadow text-center text-gray-500'>
							No commands found matching your criteria
						</div>
					) : (
						commands.map(command => (
							<div
								key={command.id}
								className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow relative'>
								<div className='space-y-4'>
									<div>
										<div className='flex flex-wrap gap-2 mb-2'>
											{command.user?.id && (
												<span className='px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1'>
													{command.user
														?.avatarUrl && (
														<Image
															src={
																command.user
																	?.avatarUrl
															}
															alt={`${command.user?.username}'s avatar`}
															width={16}
															height={16}
															className='rounded-full'
														/>
													)}
													Owner:{" "}
													{command.user?.username}
												</span>
											)}
											{command.isPrivate ? (
												<span className='px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium'>
													Private
												</span>
											) : (
												<span className='px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
													Public
												</span>
											)}
										</div>
										<h3 className='font-medium text-gray-900'>
											{command.description}
										</h3>
									</div>

									<div className='relative group'>
										<pre className='bg-gray-800 p-4 rounded-lg overflow-x-auto text-gray-100 text-sm'>
											<code>{command.code}</code>
										</pre>
										<button
											onClick={e => {
												e.stopPropagation();
												copyToClipboard(
													command.code,
													e
												);
											}}
											className={`absolute top-3 right-3 px-3 py-1.5 text-xs rounded transition-all duration-200 ${
												copiedCode === command.code
													? "bg-green-500 text-white"
													: "bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-600"
											}`}>
											{copiedCode === command.code
												? "Copied!"
												: "Copy"}
										</button>
										<button
											onClick={() =>
												onToggleFavorite(
													command.id ?? ""
												)
											}
											className='favorite-button absolute right-20 top-3 text-gray-400 hover:text-yellow-400 transition-colors'
											aria-label={
												command.isFavorite
													? "Remove from favorites"
													: "Add to favorites"
											}>
											<svg
												className={`w-6 h-6 ${
													command.isFavorite
														? "text-yellow-400 fill-current"
														: "fill-none stroke-current"
												}`}
												viewBox='0 0 24 24'
												xmlns='http://www.w3.org/2000/svg'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
												/>
											</svg>
										</button>
									</div>

									{/* {command.lastUsed && (
                    <p className="text-xs text-gray-400">
                      Last used: {new Date(command.lastUsed).toLocaleDateString()}
                    </p>
                  )} */}
									<div className='mt-3 flex flex-wrap gap-2'>
										<span className='px-2 py-1 bg-gray-100 rounded text-sm'>
											{command.category?.name}
										</span>
										{/* {command.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {tag.code}
                      </span>
                    ))} */}
									</div>
								</div>
							</div>
						))
					)}
				</>
			)}
		</div>
	);
}
