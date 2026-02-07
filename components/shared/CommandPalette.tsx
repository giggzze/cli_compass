"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  Search,
  Terminal,
  FileText,
  Plus,
  Star,
  FolderOpen,
  Tag,
  Settings,
  Home,
  Check,
  ClipboardCopy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  type: "command" | "process" | "action";
  title: string;
  description?: string;
  code?: string;
  category?: string;
  isFavorite?: boolean;
  onSelect?: () => void;
}

interface CommandPaletteProps {
  commands?: CommandItem[];
  processes?: CommandItem[];
}

export function CommandPalette({ commands = [], processes = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  // Toggle the menu when Cmd/Ctrl+K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (item.type === "command" && item.code) {
        copyToClipboard(item.code, item.id);
      } else if (item.onSelect) {
        item.onSelect();
        setOpen(false);
      }
    },
    [copyToClipboard]
  );

  // Quick actions
  const quickActions: CommandItem[] = [
    {
      id: "home",
      type: "action",
      title: "Go to Home",
      description: "Navigate to home page",
      onSelect: () => router.push("/"),
    },
    {
      id: "new-command",
      type: "action",
      title: "New Command",
      description: "Create a new command",
      onSelect: () => router.push("/private/commands/create"),
    },
    {
      id: "new-process",
      type: "action",
      title: "New Process",
      description: "Create a new process",
      onSelect: () => router.push("/private/processes/create"),
    },
    {
      id: "collections",
      type: "action",
      title: "Collections",
      description: "View your collections",
      onSelect: () => router.push("/private/collections"),
    },
    {
      id: "favorites",
      type: "action",
      title: "Favorites",
      description: "View favorite commands",
      onSelect: () => router.push("/private/commands?filter=favorites"),
    },
  ];

  const getIcon = (item: CommandItem) => {
    if (item.type === "command") return Terminal;
    if (item.type === "process") return FileText;

    switch (item.id) {
      case "home":
        return Home;
      case "new-command":
      case "new-process":
        return Plus;
      case "collections":
        return FolderOpen;
      case "favorites":
        return Star;
      default:
        return Search;
    }
  };

  return (
    <>
      {/* Keyboard shortcut hint */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="px-1.5 py-0.5 text-xs bg-white rounded border shadow-sm">
          ⌘K
        </kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command Palette"
        className="fixed inset-0 z-50"
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setOpen(false)}
        />

        <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border">
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search commands, processes, or actions..."
              className="w-full px-4 py-3 text-lg outline-none border-b"
            />

            <Command.List className="max-h-[400px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-gray-500">
                No results found.
              </Command.Empty>

              {/* Quick Actions */}
              <Command.Group heading="Quick Actions" className="mb-2">
                {quickActions.map((action) => {
                  const Icon = getIcon(action);
                  return (
                    <Command.Item
                      key={action.id}
                      value={action.title}
                      onSelect={() => handleSelect(action)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer",
                        "data-[selected=true]:bg-blue-50"
                      )}
                    >
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action.title}</p>
                        {action.description && (
                          <p className="text-xs text-gray-500">
                            {action.description}
                          </p>
                        )}
                      </div>
                    </Command.Item>
                  );
                })}
              </Command.Group>

              {/* Commands */}
              {commands.length > 0 && (
                <Command.Group heading="Commands" className="mb-2">
                  {commands.map((cmd) => {
                    const Icon = getIcon(cmd);
                    const isCopied = copiedId === cmd.id;
                    return (
                      <Command.Item
                        key={cmd.id}
                        value={`${cmd.title} ${cmd.description} ${cmd.code}`}
                        onSelect={() => handleSelect(cmd)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer",
                          "data-[selected=true]:bg-blue-50"
                        )}
                      >
                        <div className="p-1.5 bg-gray-100 rounded-md">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                              {cmd.description || cmd.title}
                            </p>
                            {cmd.isFavorite && (
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          {cmd.code && (
                            <code className="text-xs text-gray-500 truncate block">
                              {cmd.code}
                            </code>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {isCopied ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <Check className="h-3 w-3" /> Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <ClipboardCopy className="h-3 w-3" /> Copy
                            </span>
                          )}
                        </div>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              )}

              {/* Processes */}
              {processes.length > 0 && (
                <Command.Group heading="Processes" className="mb-2">
                  {processes.map((proc) => {
                    const Icon = getIcon(proc);
                    return (
                      <Command.Item
                        key={proc.id}
                        value={proc.title}
                        onSelect={() => {
                          router.push(`/private/processes/${proc.id}`);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer",
                          "data-[selected=true]:bg-blue-50"
                        )}
                      >
                        <div className="p-1.5 bg-gray-100 rounded-md">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{proc.title}</p>
                        </div>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              )}
            </Command.List>

            <div className="border-t px-4 py-2 text-xs text-gray-500 flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">↑↓</kbd> Navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">↵</kbd> Select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Esc</kbd> Close
              </span>
            </div>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}
