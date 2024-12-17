"use client";

import { useState, useMemo, useEffect } from "react";
import CommandList from "../components/CommandList";
import CommandSearch from "../components/CommandSearch";
import { Category, Command } from "@/lib/oldTyes";
import CategoryFilter from "../components/CategoryFilter";

export default function CommandsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: "all",
    name: "all",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "all" },
  ]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user ID
        const userIdResponse = await fetch("/api/user-id");
        const userIdData = await userIdResponse.json();
        if (userIdData.success) {
          setUserId(userIdData.data);
        }

        // Fetch commands first
        const commandsResponse = await fetch("/api/commands");
        const commandsData = await commandsResponse.json();
        let formattedCommands: Command[] = [];

        if (commandsData.success) {
          formattedCommands = commandsData.data
            .filter((cmd: Command) => !cmd.isPrivate || userId)
            .map((cmd: Command) => ({
              id: cmd.id,
              name: cmd.name,
              description: cmd.description,
              usage: cmd.usage,
              category: {
                id: cmd.category.id,
                name: cmd.category.name,
              },
              tags: cmd.tags || [],
              isFavorite: cmd.isFavorite ?? false,
              notes: cmd.notes,
              lastUsed: cmd.lastUsed,
              isPrivate: cmd.isPrivate,
            }));
          setCommands(formattedCommands);
        }

        // Fetch categories and filter based on commands
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          const usedCategoryIds = new Set(
            formattedCommands.map((cmd) => cmd.category.id)
          );
          const filteredCategories = categoriesData.data.filter(
            (cat: Category) => usedCategoryIds.has(cat.id)
          );

          setCategories([
            { id: "all", name: "all" },
            ...filteredCategories.map((cat: Category) => ({
              id: cat.id,
              name: cat.name,
            })),
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const favorites = commands
      .filter((cmd) => cmd.isFavorite)
      .map((cmd) => cmd.id);
    localStorage.setItem("favoriteCommands", JSON.stringify(favorites));
  }, [commands]);

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleToggleFavorite = async (commandId: string) => {
    try {
      const response = await fetch("/api/commands/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command_id: commandId,
          is_favorite: !commands.find((cmd) => cmd.id === commandId)
            ?.isFavorite,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }

      setCommands((prev) =>
        prev.map((command) =>
          command.id === commandId
            ? { ...command, isFavorite: !command.isFavorite }
            : command
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const filteredCommands = useMemo(() => {
    return commands.filter((command) => {
      // Filter by category
      if (
        selectedCategory.id !== "all" &&
        command.category.id !== selectedCategory.id
      ) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          command.name.toLowerCase().includes(query) ||
          command.description.toLowerCase().includes(query) ||
          command.usage.toLowerCase().includes(query)
        );
      }

      // Filter by favorites
      if (showFavoritesOnly && !command.isFavorite) {
        return false;
      }

      return true;
    });
  }, [commands, searchQuery, showFavoritesOnly, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 md:grid-cols-[1fr,auto] items-start">
          <div className="space-y-4">
            <CommandSearch
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
            <div className="flex flex-wrap gap-4">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              <label className="inline-flex items-end">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-500"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                />
                <span className="ml-2 text-gray-700">Show favorites only</span>
              </label>
            </div>
          </div>
          <div>
            <a
              href="/commands/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Command
            </a>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <CommandList
            commands={filteredCommands}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>
    </div>
  );
}
