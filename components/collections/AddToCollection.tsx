"use client";

import { useState } from "react";
import { FolderPlus, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface Collection {
  id: string;
  name: string;
}

interface AddToCollectionProps {
  collections: Collection[];
  memberOfCollectionIds: string[];
  onAddToCollection: (collectionId: string) => Promise<void>;
  onRemoveFromCollection: (collectionId: string) => Promise<void>;
  onCreateCollection?: (name: string) => Promise<Collection>;
  className?: string;
}

export function AddToCollection({
  collections,
  memberOfCollectionIds,
  onAddToCollection,
  onRemoveFromCollection,
  onCreateCollection,
  className,
}: AddToCollectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const toggleCollection = async (collectionId: string) => {
    setLoading(collectionId);
    try {
      if (memberOfCollectionIds.includes(collectionId)) {
        await onRemoveFromCollection(collectionId);
      } else {
        await onAddToCollection(collectionId);
      }
    } catch (error) {
      console.error("Failed to update collection membership:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim() || !onCreateCollection) return;

    setLoading("creating");
    try {
      const newCollection = await onCreateCollection(newCollectionName.trim());
      await onAddToCollection(newCollection.id);
      setNewCollectionName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create collection:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8"
      >
        <FolderPlus className="h-4 w-4 mr-1" />
        Add to collection
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg right-0">
          <div className="p-2 max-h-48 overflow-y-auto">
            {collections.length === 0 && !isCreating ? (
              <p className="text-sm text-gray-500 text-center py-2">
                No collections yet
              </p>
            ) : (
              <div className="space-y-1">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => toggleCollection(collection.id)}
                    disabled={loading !== null}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                      memberOfCollectionIds.includes(collection.id)
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <span>{collection.name}</span>
                    {loading === collection.id ? (
                      <span className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                    ) : memberOfCollectionIds.includes(collection.id) ? (
                      <Check className="h-4 w-4 text-blue-600" />
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>

          {onCreateCollection && (
            <div className="border-t border-gray-200 p-2">
              {isCreating ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Collection name..."
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateCollection();
                      if (e.key === "Escape") setIsCreating(false);
                    }}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreating(false)}
                      disabled={loading === "creating"}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateCollection}
                      disabled={!newCollectionName.trim() || loading === "creating"}
                    >
                      {loading === "creating" ? "Creating..." : "Create"}
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
                  Create new collection
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
