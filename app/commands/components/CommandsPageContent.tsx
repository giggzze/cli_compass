"use client";

import { useState, useMemo, useEffect } from "react";
import { Category, Command } from "@/lib/types";
import CommandSearch from "./CommandSearch";
import CommandFilters from "./CommandFilters";
import CategoryFilter from "./CategoryFilter";
import CommandList from "./CommandList";

interface CommandsPageContentProps {
  commandsEndpoint: string;
  shouldFetchUserId?: boolean;
}

export default function CommandsPageContent({
  commandsEndpoint,
  shouldFetchUserId = false,
}: CommandsPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: "all",
    name: "all",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showUserCommandsOnly, setShowUserCommandsOnly] = useState(false);
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
        // Fetch user ID if needed
        if (shouldFetchUserId) {
          const userIdResponse = await fetch("/api/user-id");
          const userIdData = await userIdResponse.json();
          if (userIdData.success) {
            setUserId(userIdData.data);
          }
        }

        // Fetch commands
        const commandsResponse = await fetch(commandsEndpoint);
        const commandsData = await commandsResponse.json();
        let formattedCommands: Command[] = [];

        if (commandsData.success) {
          formattedCommands = commandsData.data
            .filter((cmd: Command) => !cmd.isPrivate || userId)
            .map((cmd: Command) => ({
              id: cmd.id,
              description: cmd.description,
              code: cmd.code,
              category: {
                id: cmd.category.id,
                name: cmd.category.name,
              },
              tags: cmd.tags || [],
              isFavorite: cmd.isFavorite ?? false,
              isPrivate: cmd.isPrivate,
              userId: cmd.userId,
              user: {
                id: cmd.user.id,
                username: cmd.user.username,
                avatarUrl: cmd.user.avatarUrl,
              },
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
  }, [commandsEndpoint, shouldFetchUserId, userId]);

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

  const handleFavoritesToggle = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const filteredCommands = useMemo(() => {
    return commands.filter((cmd) => {
      // Filter by category
      if (
        selectedCategory.id !== "all" &&
        cmd.category.id !== selectedCategory.id
      ) {
        return false;
      }

      // Filter by favorites
      if (showFavoritesOnly && !cmd.isFavorite) {
        return false;
      }

      // Filter by user commands
      if (showUserCommandsOnly && cmd.userId !== userId) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          cmd.name.toLowerCase().includes(query) ||
          cmd.description.toLowerCase().includes(query) ||
          cmd.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [
    commands,
    selectedCategory,
    searchQuery,
    showFavoritesOnly,
    showUserCommandsOnly,
    userId,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <CommandSearch value={searchQuery} onChange={setSearchQuery} />
        {shouldFetchUserId && (
          <CommandFilters
            showFavorites={showFavoritesOnly}
            showUserCommands={showUserCommandsOnly}
            onFavoritesChange={setShowFavoritesOnly}
            onUserCommandsChange={setShowUserCommandsOnly}
          />
        )}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <CommandList
          commands={filteredCommands}
          isLoading={isLoading}
          showFavoritesToggle={shouldFetchUserId}
          showFavoritesOnly={showFavoritesOnly}
          onFavoritesToggle={handleFavoritesToggle}
        />
      </div>
    </div>
  );
}
