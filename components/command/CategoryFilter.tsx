import { Category } from "@/lib/db.types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                selectedCategory.id === category.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category.name === "all" ? "All Categories" : category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
