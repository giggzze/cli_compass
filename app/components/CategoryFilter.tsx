interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
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
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        {categories.map((category) => (
          <option key={category} value={category.toLowerCase()}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
