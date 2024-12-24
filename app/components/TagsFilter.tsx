"use client";

import { useState, useMemo } from "react";
import TagSearch from "./TagSearch";
import { Tag } from "@/lib/db.types";

interface TagsFilterProps {
  tags: Tag[];
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
}

export default function TagsFilter({
  tags,
  selectedTags,
  onTagToggle,
}: TagsFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTags = useMemo(() => {
    if (!searchQuery) return tags;
    const lowerQuery = searchQuery.toLowerCase();
    return tags.filter((tag) => tag.name.toLowerCase().includes(lowerQuery));
  }, [tags, searchQuery]);

  return (
    <div>
      <h3 className="font-semibold mb-2 invisible">Tags</h3>
      <TagSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex flex-wrap gap-2">
        {filteredTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            } hover:opacity-80 transition-opacity`}
          >
            {tag.name}
          </button>
        ))}
      </div>
      {filteredTags.length === 0 && (
        <p className="text-gray-500 text-sm mt-2">
          No tags found matching &quot;{searchQuery}&quot;
        </p>
      )}
    </div>
  );
}
