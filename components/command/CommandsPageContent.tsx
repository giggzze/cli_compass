"use client";

import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CommandSearch from "./CommandSearch";
import CommandFilters from "./CommandFilters";
import CategoryFilter from "./CategoryFilter";
import CommandList from "./CommandList";
import { Category, CategoryInsert } from "@/types/STT";
import { useCommandsQuery, useUserIdQuery, type CommandListItem } from "@/hooks/query";
import { commandQueryKeys } from "@/app/services/commandService";

interface CommandsPageContentProps {
  commandsEndpoint: string;
  shouldFetchUserId?: boolean;
}

export default function CommandsPageContent({
  commandsEndpoint,
  shouldFetchUserId = false,
}: CommandsPageContentProps) {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<CategoryInsert>({
    id: "all",
    name: "all",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showUserCommandsOnly, setShowUserCommandsOnly] = useState(false);

  const { data: userId = null } = useUserIdQuery(shouldFetchUserId);
  const { data: commands = [], isLoading } = useCommandsQuery(commandsEndpoint);

  const categories = useMemo((): CategoryInsert[] => {
    const withCategory = commands as CommandListItem[];
    const usedCategoryIds: Category[] = Array.from(
      new Set(
        withCategory
          .filter((cmd) => cmd.category_id != null)
          .map((cmd) => cmd.category_id)
      )
    )
      .map(
        (categoryId) =>
          withCategory.find((cmd) => cmd.category?.id === categoryId)?.category
      )
      .filter((c): c is Category => c != null);
    return [{ id: "all", name: "all" }, ...usedCategoryIds];
  }, [commands]);

  useEffect(() => {
    const favorites = commands
      .filter((cmd) => cmd.isFavorite)
      .map((cmd) => cmd.id);
    localStorage.setItem("favoriteCommands", JSON.stringify(favorites));
  }, [commands]);



  const handleCategoryChange = (category: Category | CategoryInsert) => {
    setSelectedCategory(category);
  };

  // const handleSearchChange = (query: string) => {
  //   setSearchQuery(query);
  // };

  const handleFavoritesToggle = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const handleToggleFavorite = async (commandId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/commands/user/${commandId}`, {
        method: "POST",
      });

      if (response.ok) {
        await queryClient.invalidateQueries({ queryKey: commandQueryKeys.list(commandsEndpoint) });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const filteredCommands = useMemo(() => {
    return commands.filter((cmd) => {
      // Filter by category
      if (
        selectedCategory.id !== "all" &&
        cmd.category?.id !== selectedCategory.id
      ) {
        return false;
      }

      // Filter by favorites
      if (showFavoritesOnly && !cmd.isFavorite) {
        return false;
      }

      // Filter by user commands
      if (showUserCommandsOnly && cmd.user?.id !== userId) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          cmd.code!.toLowerCase().includes(query) ||
          cmd.description!.toLowerCase().includes(query)
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

  const transformedCommands = useMemo(() => {
    return filteredCommands.map((cmd) => ({
      ...cmd,
      isFavorite: !!cmd.isFavorite,
    }));
  }, [filteredCommands]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <CommandSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
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
          commands={transformedCommands}
          isLoading={isLoading}
          showFavoritesToggle={shouldFetchUserId}
          showFavoritesOnly={showFavoritesOnly}
          onFavoritesToggle={handleFavoritesToggle}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </div>
  );
}
