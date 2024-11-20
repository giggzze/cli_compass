'use client';

import { useState, useMemo } from "react";
import CategoryFilter from "./components/CategoryFilter";
import TagsFilter from "./components/TagsFilter";
import CommandList from "./components/CommandList";
import CommandSearch from "./components/CommandSearch";
import { Command } from "./components/types";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample data - replace with your actual data
  const categories = ['All', 'System', 'Network', 'File Management', 'Process'];
  const tags = ['Linux', 'MacOS', 'Windows', 'Beginner', 'Advanced'];
  
  const commands = useMemo<Command[]>(() => [
    {
      id: '1',
      name: 'ls',
      description: 'List directory contents',
      category: 'File Management',
      tags: ['Linux', 'MacOS', 'Beginner'],
    },
    {
      id: '2',
      name: 'ps',
      description: 'Report a snapshot of current processes',
      category: 'Process',
      tags: ['Linux', 'MacOS', 'Advanced'],
    },
    {
      id: '3',
      name: 'ping',
      description: 'Send ICMP ECHO_REQUEST to network hosts',
      category: 'Network',
      tags: ['Linux', 'Windows', 'MacOS', 'Beginner'],
    },
    // Add more commands as needed
  ], []);

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

  const filteredCommands = useMemo(() => {
    return commands.filter(command => {
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
  }, [commands, selectedCategory, selectedTags, searchQuery]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Command Search */}
        <CommandSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

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
          </div>

          {/* Command List */}
          <CommandList commands={filteredCommands} />
        </div>
      </div>
    </div>
  );
}
