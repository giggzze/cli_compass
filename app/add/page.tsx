'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Command } from '../components/types';

export default function AddCommand() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'System',
    customCategory: '',
    tags: [] as string[],
  });
  const [selectedTag, setSelectedTag] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const categories = ['System', 'Network', 'File Management', 'Process', 'Custom'];
  const availableTags = ['Linux', 'MacOS', 'Windows', 'Beginner', 'Advanced'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Load existing commands
    const existingCommands = localStorage.getItem('commands');
    const commands: Command[] = existingCommands ? JSON.parse(existingCommands) : [];

    // Create new command
    const newCommand: Command = {
      id: Date.now().toString(), // Simple ID generation
      ...formData,
      category: isCustomCategory ? formData.customCategory : formData.category,
      isFavorite: false,
    };

    // Add new command to list
    commands.push(newCommand);

    // Save back to localStorage
    localStorage.setItem('commands', JSON.stringify(commands));

    // Redirect to home page
    router.push('/');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIsCustomCategory(value === 'Custom');
    setFormData(prev => ({
      ...prev,
      category: value,
      customCategory: value === 'Custom' ? prev.customCategory : ''
    }));
  };

  const handleTagAdd = () => {
    if (selectedTag && !formData.tags.includes(selectedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, selectedTag]
      }));
      setSelectedTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add New Command</h1>
          <Link
            href="/"
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Command Name */}
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-2">
              Command Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., ls"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Describe what the command does..."
            />
          </div>

          {/* Category */}
          <div className="space-y-4">
            <label htmlFor="category" className="block font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            
            {isCustomCategory && (
              <div className="mt-2">
                <label htmlFor="customCategory" className="block font-medium text-gray-700 mb-2">
                  Enter Custom Category
                </label>
                <input
                  type="text"
                  id="customCategory"
                  required={isCustomCategory}
                  value={formData.customCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a new category name..."
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a tag...</option>
                {availableTags
                  .filter(tag => !formData.tags.includes(tag))
                  .map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={handleTagAdd}
                disabled={!selectedTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Command
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
