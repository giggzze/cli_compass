import { Category } from "@/lib/oldTyes";

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
      <select
        value={selectedCategory.id}
        onChange={(e) => {
          const category = categories.find((c) => c.id === e.target.value);
          if (category) {
            onCategoryChange(category);
          }
        }}
        className="w-full p-2 border rounded-md"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name === "all" ? "All Categories" : category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
