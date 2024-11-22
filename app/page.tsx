'use client';

import { useState, useMemo, useEffect } from "react";
import CategoryFilter from "./components/CategoryFilter";
import TagsFilter from "./components/TagsFilter";
import CommandList from "./components/CommandList";
import CommandSearch from "./components/CommandSearch";
import { Command } from "./components/types";
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Sample data - replace with your actual data
  const categories = ['All', 'System', 'Network', 'File Management', 'Process'];
  const tags = ['Linux', 'MacOS', 'Windows', 'Beginner', 'Advanced'];

  const [commands, setCommands] = useState<Command[]>(() => {
    // Load commands from localStorage if available
    if (typeof window !== 'undefined') {
      const savedCommands = localStorage.getItem('commands');
      if (savedCommands) {
        return JSON.parse(savedCommands);
      }
    }
    // Initial commands data
    return [
      {
        id: '1',
        name: 'ls',
        description: 'List directory contents',
        category: 'File Management',
        tags: ['Linux', 'MacOS', 'Beginner'],
        isFavorite: false,
      },
      {
        id: '2',
        name: 'ps',
        description: 'Report a snapshot of current processes',
        category: 'Process',
        tags: ['Linux', 'MacOS', 'Advanced'],
        isFavorite: false,
      },
      {
        id: '3',
        name: 'ping',
        description: 'Send ICMP ECHO_REQUEST to network hosts',
        category: 'Network',
        tags: ['Linux', 'Windows', 'MacOS', 'Beginner'],
        isFavorite: false,
      },
    ];
  });

  // Save commands to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('commands', JSON.stringify(commands));
    }
  }, [commands]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category.toLowerCase());
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleToggleFavorite = (commandId: string) => {
    setCommands(prevCommands =>
      prevCommands.map(command =>
        command.id === commandId
          ? { ...command, isFavorite: !command.isFavorite }
          : command
      )
    );
  };

  const filteredCommands = useMemo(() => {
    return commands.filter(command => {
      // Favorites filter
      if (showFavoritesOnly && !command.isFavorite) {
        return false;
      }

      // Category filter
      const categoryMatch = selectedCategory === 'all' || 
        command.category.toLowerCase() === selectedCategory;

      // Tags filter
      const tagMatch = selectedTags.length === 0 || 
        selectedTags.some(tag => command.tags.includes(tag));

      // Search query filter
      const searchMatch = !searchQuery || 
        command.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.name.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && tagMatch && searchMatch;
    });
  }, [commands, selectedCategory, selectedTags, searchQuery, showFavoritesOnly]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search and Add Button */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <CommandSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          <Link
            href="/add"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Command
          </Link>

            <UserButton />
        </div>

        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar Filters */}
          <div className="space-y-6 bg-white p-4 rounded-lg shadow">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            <TagsFilter
              tags={tags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />
            <div>
              <h3 className="font-semibold mb-2">Favorites</h3>
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`w-full p-2 rounded-md border transition-colors ${
                  showFavoritesOnly 
                    ? 'bg-yellow-100 border-yellow-400 text-yellow-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className={`w-5 h-5 ${showFavoritesOnly ? 'text-yellow-500' : 'text-gray-400'}`}
                    viewBox="0 0 24 24"
                    fill={showFavoritesOnly ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  {showFavoritesOnly ? 'Show All' : 'Show Favorites'}
                </div>
              </button>
            </div>
          </div>

          {/* Command List */}
          <CommandList 
            commands={filteredCommands} 
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  );
}
