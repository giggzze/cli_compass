import { Command } from './types';

interface CommandListProps {
  commands: Command[];
  onToggleFavorite: (commandId: string) => void;
}

export default function CommandList({ commands, onToggleFavorite }: CommandListProps) {
  return (
    <div className="grid gap-4">
      {commands.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          No commands found matching your criteria
        </div>
      ) : (
        commands.map((command) => (
          <div
            key={command.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow relative"
          >
            <button
            onClick={() => onToggleFavorite(command.id ?? '')}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label={command.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg
                className={`w-6 h-6 ${command.isFavorite ? 'text-yellow-400 fill-current' : 'fill-none stroke-current'}`}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
            <div className="pr-10">
              <h3 className="font-semibold text-lg">{command.name}</h3>
              <p className="text-gray-600 mt-1">{command.description}</p>
              <code className="block bg-gray-50 p-2 rounded mt-2 text-sm font-mono">
                {command.usage}
              </code>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {command.category.name}
                </span>
                {command.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
