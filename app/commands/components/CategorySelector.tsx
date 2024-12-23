import { Loader2 } from "lucide-react";
import Custom from "./Custom";

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  categories: Category[];
  isLoading: boolean;
  selectedCategory: string;
  customCategory: string;
  isCustomCategory: boolean;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCustomCategoryChange: (value: string) => void;
}

export default function CategorySelector({
  categories,
  isLoading,
  selectedCategory,
  customCategory,
  isCustomCategory,
  onCategoryChange,
  onCustomCategoryChange,
}: CategorySelectorProps) {
  return (
    <div className="space-y-4">
      <label
        htmlFor="category"
        className="block font-medium text-gray-700 mb-2"
      >
        Category
      </label>

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading categories...</span>
        </div>
      ) : (
        <select
          id="category"
          value={selectedCategory}
          onChange={onCategoryChange}
          hidden={categories.length === 0}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
            <option value="custom">Create new category</option>
          </>
        </select>
      )}
      {(isCustomCategory || (categories.length === 0 && !isLoading)) && (
        <div>
          {categories.length === 0 && (
            <p className="text-sm text-gray-600 mb-2">
              No categories exist yet. Create your first category:
            </p>
          )}

          <Custom
            isCustomCategory={isCustomCategory || categories.length === 0}
            customCategory={customCategory}
            onCustomCategoryChange={onCustomCategoryChange}
          />
        </div>
      )}
    </div>
  );
}
