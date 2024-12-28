import React from "react";

interface LoadingProps {
	size?: "small" | "medium" | "large";
	color?: string;
}

const Loading: React.FC<LoadingProps> = ({
	size = "medium",
	color = "bg-blue-600",
}) => {
	const sizeClasses = {
		small: "h-2 w-2",
		medium: "h-4 w-4",
		large: "h-6 w-6",
	};

	const dotClass = `${sizeClasses[size]} rounded-full animate-bounce`;
	const bgColor = color.startsWith('bg-') ? color : `bg-${color.replace('text-', '')}`;

	return (
		<div className='flex items-center justify-center gap-2 h-8'>
			{[0, 1, 2, 3].map(index => (
				<div
					key={index}
					className={`${dotClass} ${bgColor}`}
					style={{
						animationDelay: `${index * 0.15}s`,
						animationDuration: '0.8s',
					}}
				/>
			))}
		</div>
	);
};

export default Loading;
