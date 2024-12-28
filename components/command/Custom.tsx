import React from "react";

interface CustomProps {
  isCustomCategory: boolean;
  customCategory: string;
  onCustomCategoryChange: (value: string) => void;
}

function Custom({
  isCustomCategory,
  customCategory,
  onCustomCategoryChange,
}: CustomProps) {
  return (
    <div className="mt-2">
      <label
        htmlFor="customCategory"
        className="block font-medium text-gray-700 mb-2"
      >
        Enter A New Category
      </label>
      <input
        type="text"
        id="customCategory"
        required={isCustomCategory}
        value={customCategory}
        onChange={(e) => onCustomCategoryChange(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter a new category name..."
      />
    </div>
  );
}

export default Custom;
