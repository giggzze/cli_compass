"use client";

import { useState, useEffect } from "react";
import { Plus, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { TagBadge } from "./TagBadge";

interface Tag {
  id: string;
  name: string;
  color: string | null;
}

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  onCreateTag?: (name: string, color: string) => Promise<Tag>;
  className?: string;
}

const TAG_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
];

export function TagSelector({
  availableTags,
  selectedTagIds,
  onChange,
  onCreateTag,
  className,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[6]); // Default indigo

  const selectedTags = availableTags.filter((tag) =>
    selectedTagIds.includes(tag.id)
  );

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim() || !onCreateTag) return;

    try {
      const newTag = await onCreateTag(newTagName.trim(), newTagColor);
      onChange([...selectedTagIds, newTag.id]);
      setNewTagName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            color={tag.color}
            onRemove={() => toggleTag(tag.id)}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-7 px-2 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Tag
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-2 max-h-48 overflow-y-auto">
            {availableTags.length === 0 && !isCreating ? (
              <p className="text-sm text-gray-500 text-center py-2">
                No tags yet. Create one below.
              </p>
            ) : (
              <div className="space-y-1">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                      selectedTagIds.includes(tag.id)
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <TagBadge name={tag.name} color={tag.color} size="sm" />
                    {selectedTagIds.includes(tag.id) && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {onCreateTag && (
            <div className="border-t border-gray-200 p-2">
              {isCreating ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Tag name..."
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateTag();
                      if (e.key === "Escape") setIsCreating(false);
                    }}
                  />
                  <div className="flex flex-wrap gap-1">
                    {TAG_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTagColor(color)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-transform",
                          newTagColor === color
                            ? "border-gray-900 scale-110"
                            : "border-transparent hover:scale-105"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim()}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create new tag
                </button>
              )}
            </div>
          )}

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
    </div>
  );
}
