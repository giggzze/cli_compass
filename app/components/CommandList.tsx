import { Command } from './types';

interface CommandListProps {
  commands: Command[];
}

export default function CommandList({ commands }: CommandListProps) {
  return (
    <div className="grid gap-4">
      {commands.map((command) => (
        <div
          key={command.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-lg">{command.name}</h3>
          <p className="text-gray-600 mt-1">{command.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
              {command.category}
            </span>
            {command.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
