
import { useState, useMemo } from "react";
import {
  Search,
  X,
  Clock,
  Terminal,
  FileText,
  Filter,
  Star,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSearch, applyFilters, SearchFilters } from "@/hooks/useSearch";
import { TagFilter } from "../tags";

interface SearchableCommand {
  id: string;
  description: string | null;
  code: string | null;
  categoryId: string | null;
  isFavorite?: boolean;
  createdAt?: string | null;
  category?: { id: string; name: string | null };
  tags?: { id: string; name: string; color: string | null }[];
}

interface SearchableProcess {
  id: string;
  title: string | null;
  createdAt?: string | null;
}

interface Category {
  id: string;
  name: string | null;
}

interface Tag {
  id: string;
  name: string;
  color: string | null;
}

interface UnifiedSearchProps {
  commands: SearchableCommand[];
  processes: SearchableProcess[];
  categories: Category[];
  tags: Tag[];
  onSelectCommand?: (command: SearchableCommand) => void;
  onSelectProcess?: (process: SearchableProcess) => void;
  className?: string;
}

type SearchResultType = "all" | "commands" | "processes";

export function UnifiedSearch({
  commands,
  processes,
  categories,
  tags,
  onSelectCommand,
  onSelectProcess,
  className,
}: UnifiedSearchProps) {
  const [resultType, setResultType] = useState<SearchResultType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Search commands
  const commandSearch = useSearch({
    items: commands,
    keys: ["description", "code", "category.name"],
    threshold: 0.4,
  });

  // Search processes
  const processSearch = useSearch({
    items: processes,
    keys: ["title"],
    threshold: 0.4,
  });

  // Unified query handling
  const setQuery = (q: string) => {
    commandSearch.setQuery(q);
    processSearch.setQuery(q);
  };

  // Apply filters to command results
  const filteredCommands = useMemo(() => {
    return applyFilters(commandSearch.results, filters, {
      getCategoryId: (cmd) => cmd.categoryId,
      getTagIds: (cmd) => cmd.tags?.map((t) => t.id) || [],
      getIsFavorite: (cmd) => cmd.isFavorite || false,
      getCreatedAt: (cmd) => cmd.createdAt,
    });
  }, [commandSearch.results, filters]);

  // Combine results
  const combinedResults = useMemo(() => {
    const cmdResults = filteredCommands.map((cmd) => ({
      type: "command" as const,
      item: cmd,
    }));

    const procResults = processSearch.results.map((proc) => ({
      type: "process" as const,
      item: proc,
    }));

    switch (resultType) {
      case "commands":
        return cmdResults;
      case "processes":
        return procResults;
      default:
        return [...cmdResults, ...procResults];
    }
  }, [filteredCommands, processSearch.results, resultType]);

  const hasActiveFilters =
    filters.categoryId ||
    (filters.tagIds && filters.tagIds.length > 0) ||
    filters.favorites;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={commandSearch.query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commands, processes..."
          className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        {commandSearch.query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Filter & Type Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Result type tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { value: "all", label: "All" },
              { value: "commands", label: "Commands" },
              { value: "processes", label: "Processes" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setResultType(tab.value as SearchResultType)}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-colors",
                  resultType === tab.value
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={hasActiveFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                active
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 ml-1 transition-transform",
                showFilters && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.categoryId || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      categoryId: e.target.value || undefined,
                    })
                  }
                  className="px-3 py-1.5 text-sm border rounded-md"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Favorites Toggle */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Favorites
              </label>
              <button
                onClick={() =>
                  setFilters({ ...filters, favorites: !filters.favorites })
                }
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md transition-colors",
                  filters.favorites
                    ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                    : "bg-white"
                )}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    filters.favorites && "fill-yellow-500 text-yellow-500"
                  )}
                />
                Only favorites
              </button>
            </div>
          </div>

          {/* Tags Filter */}
          {tags.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tags
              </label>
              <TagFilter
                tags={tags}
                selectedTagIds={filters.tagIds || []}
                onChange={(tagIds) => setFilters({ ...filters, tagIds })}
              />
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({})}
              className="text-gray-500"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {/* Recent Searches */}
      {!commandSearch.isSearching &&
        commandSearch.recentSearches.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Recent:</span>
            {commandSearch.recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => setQuery(search)}
                className="px-2 py-0.5 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                {search}
              </button>
            ))}
            <button
              onClick={commandSearch.clearRecentSearches}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          </div>
        )}

      {/* Results */}
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          {combinedResults.length} result{combinedResults.length !== 1 && "s"}
          {commandSearch.isSearching && ` for "${commandSearch.query}"`}
        </p>

        <div className="divide-y border rounded-lg overflow-hidden">
          {combinedResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found</p>
              {commandSearch.isSearching && (
                <p className="text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          ) : (
            combinedResults.map((result) =>
              result.type === "command" ? (
                <div
                  key={`cmd-${result.item.id}`}
                  onClick={() => onSelectCommand?.(result.item)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Terminal className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                          Command
                        </span>
                        {result.item.category?.name && (
                          <span className="text-xs text-gray-500">
                            {result.item.category.name}
                          </span>
                        )}
                        {result.item.isFavorite && (
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-900">
                        {result.item.description}
                      </p>
                      {result.item.code && (
                        <code className="mt-1 block text-xs bg-gray-900 text-gray-100 p-2 rounded truncate">
                          {result.item.code}
                        </code>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={`proc-${result.item.id}`}
                  onClick={() => onSelectProcess?.(result.item)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        Process
                      </span>
                      <p className="mt-1 text-sm text-gray-900">
                        {result.item.title}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
