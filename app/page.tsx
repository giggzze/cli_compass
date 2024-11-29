'use client';

import { useState, useMemo, useEffect } from "react";
import TagsFilter from "./components/TagsFilter";
import CommandList from "./components/CommandList";
import CommandSearch from "./components/CommandSearch";
import { Command, Tag } from "./components/types";
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function Home() {
  // const [selectedCategory, setSelectedCategory] = useState<Category>({ id: 'all', name: 'all' });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // const [categories, setCategories] = useState<Category[]>([
  //   { id: 'all', name: 'all' }
  // ]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);

  // Fetch all necessary data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        // const categoriesResponse = await fetch('/api/categories');
        // const categoriesData = await categoriesResponse.json();
        // if (categoriesData.success) {
        //   // setCategories([
        //   //   { id: 'all', name: 'all' },
        //   //   ...categoriesData.data.map((cat: Category) => ({
        //   //     id: cat.id,
        //   //     name: cat.name,
        //   //   })),
        //   ]);
        // }

        // Fetch tags
        const tagsResponse = await fetch('/api/tags');
        const tagsData = await tagsResponse.json();
        if (tagsData.success) {
          setTags(tagsData.data);
        }

        // Fetch commands
        const commandsResponse = await fetch('/api/commands');
        const commandsData = await commandsResponse.json();
        if (commandsData.success) {
          const formattedCommands = commandsData.data.map((cmd: Command) => ({
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
          }));
          setCommands(formattedCommands);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    const favorites = commands
      .filter(cmd => cmd.isFavorite)
      .map(cmd => cmd.id);
    localStorage.setItem('favoriteCommands', JSON.stringify(favorites));
  }, [commands]);

  // const handleCategoryChange = (category: Category) => {
  //   setSelectedCategory(category);
  // };

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags(prev =>
      prev.some(t => t.id === tag.id)
        ? prev.filter(t => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleToggleFavorite = async (commandId: string) => {
    try {
      const response = await fetch('/api/commands/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command_id: commandId,
          is_favorite: !commands.find(cmd => cmd.id === commandId)?.isFavorite,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      setCommands(prev =>
        prev.map(command =>
          command.id === commandId
            ? { ...command, isFavorite: !command.isFavorite }
            : command
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    }
  };

  const filteredCommands = useMemo(() => {
    return commands.filter(command => {
      // Filter by category
      // if (selectedCategory.id !== 'all' && command.category.id !== selectedCategory.id) {
      //   return false;
      // }

      // Filter by tags
      if (selectedTags.length > 0) {
        const commandTagIds = command.tags.map(tag => tag.id);
        const selectedTagIds = selectedTags.map(tag => tag.id);
        if (!selectedTagIds.every(tagId => commandTagIds.includes(tagId))) {
          return false;
        }
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
  }, [commands, selectedTags, searchQuery, showFavoritesOnly]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CLI Compass</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/add"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Command
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 md:grid-cols-[1fr,auto] items-start">
          <div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-full sm:flex-1 justify-end items-end">
                <h1 className="invisible">s</h1>
                <CommandSearch
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                />
              </div>
              <TagsFilter
                tags={tags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />

                <span className="ml-2">Favorites</span>
              <label className="inline-flex items-center whitespace-nowrap">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-500"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading commands...</p>
          </div>
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
