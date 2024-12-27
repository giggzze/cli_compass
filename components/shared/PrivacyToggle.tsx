interface PrivacyToggleProps {
  isPrivate: boolean;
  onChange: (isPrivate: boolean) => void;
}

export function PrivacyToggle({ isPrivate, onChange }: PrivacyToggleProps) {
  return (
    <div className="mb-6">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <span className="text-sm text-gray-700">Make this process private</span>
      </label>
      <p className="mt-1 text-sm text-gray-500">
        Private processes are only visible to you.
      </p>
      <p className="mt-1 text-sm text-red-500">
        This setting cannot be changed later.
      </p>
    </div>
  );
}
