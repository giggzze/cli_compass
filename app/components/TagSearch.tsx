interface TagSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TagSearch({
  searchQuery,
  onSearchChange,
}: TagSearchProps) {
  return (
    <div className="mb-3">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tags..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
