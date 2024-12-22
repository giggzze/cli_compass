"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "../../components/PageLayout";
import FormInput from "../../components/FormInput";
import CategorySelector from "../../components/CategorySelector";
import { Button } from "../../components/ui/button";
import { CategoryService } from "../../services/categoryService";
import { CommandService } from "../../services/commandService";
import { Category, CommandFormData, CreateCommandDTO } from "@/lib/types";
import { toast } from "react-toastify";

const initialFormData: CommandFormData = {
  name: "",
  description: "",
  category_id: "",
  customCategory: "",
  tags: [],
  is_private: true,
};

export default function AddCommand() {
  const router = useRouter();
  const [formData, setFormData] = useState<CommandFormData>(initialFormData);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await CategoryService.getAllCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            category_id: categoriesData[0].id,
          }));
        }
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load categories";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      let categoryId = formData.category_id;

      // Handle category creation if needed
      if ((isCustomCategory || categories.length === 0) && formData.customCategory.trim()) {
        const newCategory = await CategoryService.createCategory(formData.customCategory.trim());
        categoryId = newCategory.id;
      }

      // Validate category
      if (!categoryId) {
        if (categories.length > 0 && !isCustomCategory) {
          throw new Error("Please select a category");
        }
        if (!formData.customCategory?.trim()) {
          throw new Error("Please enter a category name");
        }
      }

      // Create command
      const commandData: CreateCommandDTO = {
        name: formData.name,
        description: formData.description,
        categoryId: categoryId,
        tags: formData.tags,
        isPrivate: formData.is_private,
      };

      const success = await CommandService.createCommand(commandData, "user");
      if (success) {
        toast.success("Command created successfully!");
        router.push("/commands");
        router.refresh();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const isCustom = value === "custom";
    setIsCustomCategory(isCustom);
    setFormData(prev => ({
      ...prev,
      category_id: isCustom ? "" : value,
      customCategory: isCustom ? prev.customCategory : "",
    }));
  };

  if (error && !isLoadingCategories) {
    return (
      <PageLayout title="Error" backLink="/commands">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Add New Command" backLink="/commands">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <FormInput
          id="name"
          label="Command Name"
          value={formData.name}
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="e.g., ls"
          required
        />

        <FormInput
          id="description"
          label="Description"
          value={formData.description}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          type="textarea"
          placeholder="Describe what the command does..."
          required
        />

        <CategorySelector
          categories={categories}
          isLoading={isLoadingCategories}
          selectedCategory={formData.category_id}
          customCategory={formData.customCategory}
          isCustomCategory={isCustomCategory}
          onCategoryChange={handleCategoryChange}
          onCustomCategoryChange={(value) =>
            setFormData(prev => ({ ...prev, customCategory: value }))
          }
        />

        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_private}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, is_private: e.target.checked }))
              }
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="text-sm text-gray-700">Make this command private</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Private commands are only visible to you
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Adding..." : "Add Command"}
        </Button>
      </form>
    </PageLayout>
  );
}
