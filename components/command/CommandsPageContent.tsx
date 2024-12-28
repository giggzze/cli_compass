"use client";

import { useState, useMemo, useEffect } from "react";
import CommandSearch from "./CommandSearch";
import CommandFilters from "./CommandFilters";
import CategoryFilter from "./CategoryFilter";
import CommandList from "./CommandList";
import { ICategory } from "@/app/models/Category";
import { ICommand, IGetCommand } from "@/app/models/Command";

interface CommandsPageContentProps {
  commandsEndpoint: string;
  shouldFetchUserId?: boolean;
}

export default function CommandsPageContent({
  commandsEndpoint,
  shouldFetchUserId = false,
}: CommandsPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<ICategory>({
    id: "all",
    name: "all",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showUserCommandsOnly, setShowUserCommandsOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([
    { id: "all", name: "all" },
  ]);
  const [commands, setCommands] = useState<IGetCommand[]>([]);
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

        if (commandsData.success) {
          setCommands(commandsData.data);
        }

        // ensure we only have unique categories
        const usedCategoryIds: ICategory[] = Array.from(
          new Set(
            commandsData.data
              .filter((cmd: IGetCommand) => cmd.category !== null)
              .map((cmd: IGetCommand) => cmd.category!.id)
          )
        )
          .map(
            (categoryId) =>
              commandsData.data.find(
                (cmd: IGetCommand) => cmd.category?.id === categoryId
              )?.category!
          )
          .filter((category): category is ICategory => category !== undefined);

        setCategories([{ id: "all", name: "all" }, ...usedCategoryIds]);
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

  const handleCategoryChange = (category: ICategory) => {
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
        setCommands(
          commands.map((cmd) =>
            cmd.id === commandId ? { ...cmd, isFavorite: !cmd.isFavorite } : cmd
          )
        );
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
