
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { TagBadge } from "./TagBadge";

interface Tag {
  id: string;
  name: string;
  color: string | null;
}

interface TagFilterProps {
  tags: Tag[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  className?: string;
}

export function TagFilter({
  tags,
  selectedTagIds,
  onChange,
  className,
}: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const clearFilters = () => {
    onChange([]);
  };

  const hasFilters = selectedTagIds.length > 0;

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={hasFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8"
        >
          <Filter className="h-4 w-4 mr-1" />
          Filter by tags
          {hasFilters && (
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
              {selectedTagIds.length}
            </span>
          )}
        </Button>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Filter by tags
            </h4>
            {tags.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No tags available
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      "transition-all",
                      selectedTagIds.includes(tag.id)
                        ? "ring-2 ring-offset-1 ring-gray-900 rounded-full"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <TagBadge name={tag.name} color={tag.color} size="sm" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 p-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {hasFilters && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedTagIds.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            if (!tag) return null;
            return (
              <TagBadge
                key={tag.id}
                name={tag.name}
                color={tag.color}
                size="sm"
                onRemove={() => toggleTag(tag.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
