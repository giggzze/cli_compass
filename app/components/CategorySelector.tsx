"use client";

import { useState, useEffect } from "react";
import { Category } from "@/lib/oldTyes";

interface CategorySelectorProps {
  onCategoryChange: (category: Category) => void;
  selectedCategory?: Category;
}

export default function CategorySelector({
  onCategoryChange,
  selectedCategory,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
          // If no category is selected and we have categories, select the first one
          if (!selectedCategory && data.data.length > 0) {
            onCategoryChange(data.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [onCategoryChange, selectedCategory]);

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <select
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      value={selectedCategory?.id || ""}
      onChange={(e) => {
        const category = categories.find((c) => c.id === e.target.value);
        if (category) {
          onCategoryChange(category);
        }
      }}
    >
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
