
import { useState } from "react";

import { Link2, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface LinkedCommand {
  id: string;
  description: string | null;
  code: string | null;
  relationshipType: string | null;
  category?: {
    id: string;
    name: string | null;
  };
}

interface RelatedCommandsProps {
  commandId: string;
  relatedCommands: LinkedCommand[];
  onLinkCommand?: (relatedCommandId: string, type: string) => Promise<void>;
  onUnlinkCommand?: (relatedCommandId: string) => Promise<void>;
  availableCommands?: LinkedCommand[];
  className?: string;
  isEditable?: boolean;
}

const RELATIONSHIP_TYPES = [
  { value: "related", label: "Related" },
  { value: "prerequisite", label: "Prerequisite" },
  { value: "follow-up", label: "Follow-up" },
  { value: "alternative", label: "Alternative" },
];

export function RelatedCommands({
  commandId,
  relatedCommands,
  onLinkCommand,
  onUnlinkCommand,
  availableCommands = [],
  className,
  isEditable = false,
}: RelatedCommandsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedType, setSelectedType] = useState("related");
  const [loading, setLoading] = useState<string | null>(null);

  const handleLink = async (relatedCommandId: string) => {
    if (!onLinkCommand) return;
    setLoading(relatedCommandId);
    try {
      await onLinkCommand(relatedCommandId, selectedType);
      setShowLinkDialog(false);
    } catch (error) {
      console.error("Failed to link command:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleUnlink = async (relatedCommandId: string) => {
    if (!onUnlinkCommand) return;
    setLoading(relatedCommandId);
    try {
      await onUnlinkCommand(relatedCommandId);
    } catch (error) {
      console.error("Failed to unlink command:", error);
    } finally {
      setLoading(null);
    }
  };

  // Filter out already linked commands
  const linkableCommands = availableCommands.filter(
    (cmd) =>
      cmd.id !== commandId &&
      !relatedCommands.some((rc) => rc.id === cmd.id)
  );

  if (relatedCommands.length === 0 && !isEditable) {
    return null;
  }

  return (
    <div className={cn("border rounded-lg bg-white", className)}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">
            Related Commands ({relatedCommands.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t">
          {relatedCommands.length === 0 ? (
            <p className="p-3 text-sm text-gray-500 text-center">
              No related commands linked yet
            </p>
          ) : (
            <div className="divide-y">
              {relatedCommands.map((cmd) => (
                <div
                  key={cmd.id}
                  className="p-3 flex items-start justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {cmd.category?.name && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                          {cmd.category.name}
                        </span>
                      )}
                      {cmd.relationshipType && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 rounded-full text-blue-600">
                          {cmd.relationshipType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {cmd.description}
                    </p>
                    {cmd.code && (
                      <code className="mt-1 block text-xs bg-gray-900 text-gray-100 p-2 rounded truncate">
                        {cmd.code}
                      </code>
                    )}
                  </div>
                  {isEditable && onUnlinkCommand && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnlink(cmd.id)}
                      disabled={loading === cmd.id}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {isEditable && onLinkCommand && (
            <div className="border-t p-3">
              {showLinkDialog ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Relationship Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-md"
                    >
                      {RELATIONSHIP_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="max-h-40 overflow-y-auto border rounded-md">
                    {linkableCommands.length === 0 ? (
                      <p className="p-3 text-sm text-gray-500 text-center">
                        No commands available to link
                      </p>
                    ) : (
                      <div className="divide-y">
                        {linkableCommands.map((cmd) => (
                          <button
                            key={cmd.id}
                            type="button"
                            onClick={() => handleLink(cmd.id)}
                            disabled={loading !== null}
                            className="w-full p-2 text-left hover:bg-gray-50 text-sm"
                          >
                            <span className="text-gray-700 line-clamp-1">
                              {cmd.description}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLinkDialog(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLinkDialog(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Link Command
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
