'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddCommand() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    customCategory: '',
    tags: [] as string[],
  });
  // const [selectedTag, setSelectedTag] = useState('');
  // const [isCustomTag, setIsCustomTag] = useState(false);
  // const [customTag, setCustomTag] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  // const [availableTags, setAvailableTags] = useState<Array<{ id: string; name: string }>>([]);
  // const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
          if (categoriesData.data.length > 0) {
            setFormData(prev => ({ ...prev, category_id: categoriesData.data[0].id }));
          }
        }

        // Fetch tags
        // const tagsResponse = await fetch('/api/tags');
        // const tagsData = await tagsResponse.json();
        // if (tagsData.success) {
        //   setAvailableTags(tagsData.data);
        // }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingCategories(false);
        // setIsLoadingTags(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // If it's a custom category, create it first
      let categoryId = formData.category_id;
      if (isCustomCategory && formData.customCategory.trim()) {
        const categoryResponse = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.customCategory.trim(),
          }),
        });

        if (!categoryResponse.ok) {
          throw new Error('Failed to create category');
        }

        const categoryData = await categoryResponse.json();
        if (categoryData.success) {
          categoryId = categoryData.data.id;
        } else {
          throw new Error(categoryData.error || 'Failed to create category');
        }
      }

      if (!categoryId && !isCustomCategory) {
        throw new Error('Please select a category');
      }

      const response = await fetch('/api/commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category_id: categoryId,
          tags: formData.tags,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/');
        router.refresh();
      } else {
        console.error('Failed to add command:', data.error);
        alert('Failed to add command. Please try again.');
      }
    } catch (error) {
      console.error('Error adding command:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const isCustom = value === 'custom';
    setIsCustomCategory(isCustom);
    setFormData(prev => ({
      ...prev,
      category_id: isCustom ? '' : value,
      customCategory: isCustom ? prev.customCategory : ''
    }));
  };

  // const handleTagAdd = async () => {
  //   if (!selectedTag) return;

  //   if (selectedTag === 'custom') {
  //     if (!customTag.trim()) return;

  //     try {
  //       const response = await fetch('/api/tags', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           name: customTag.trim(),
  //         }),
  //       });

  //       const data = await response.json();
  //       if (data.success) {
  //         setFormData(prev => ({
  //           ...prev,
  //           tags: [...prev.tags, customTag.trim()],
  //         }));
  //         setAvailableTags(prev => [...prev, data.data]);
  //         setCustomTag('');
  //       } else {
  //         console.error('Failed to create tag:', data.error);
  //       }
  //     } catch (error) {
  //       console.error('Error creating tag:', error);
  //     }
  //   } else {
  //     setFormData(prev => ({
  //       ...prev,
  //       tags: [...prev.tags, selectedTag],
  //     }));
  //   }

  //   setSelectedTag('');
  //   setIsCustomTag(false);
  // };

  // const handleTagRemove = (tagToRemove: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     tags: prev.tags.filter(tag => tag !== tagToRemove)
  //   }));
  // };

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
              value={formData.category_id}
              onChange={handleCategoryChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoadingCategories ? (
                <option>Loading...</option>
              ) : (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
              <option value="custom" >Custom</option>
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

     

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Command'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
