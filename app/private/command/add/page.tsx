"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/command/PageLayout";
import FormInput from "@/components/shared/FormInput";
import CategorySelector from "@/components/command/CategorySelector";
import { Button } from "@/components/ui/button";

export default function AddCommandPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: "",
    code: "",
    categoryId: "",
    customCategory: "",
    isPrivate: true,
  });
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
          if (categoriesData.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              categoryId: categoriesData.data[0].id,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // If it's a custom category or there are no categories, create a new one
      let categoryId = formData.categoryId;
      if (
        (isCustomCategory || categories.length === 0) &&
        formData.customCategory.trim()
      ) {
        const categoryResponse = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.customCategory.trim(),
          }),
        });

        if (!categoryResponse.ok) {
          throw new Error("Failed to create category");
        }

        const categoryData = await categoryResponse.json();
        if (categoryData.success) {
          categoryId = categoryData.data.id;
        } else {
          throw new Error(categoryData.error || "Failed to create category");
        }
      }

      // Validate category
      if (!categoryId && categories.length > 0 && !isCustomCategory) {
        throw new Error("Please select a category");
      }

      if (
        !categoryId &&
        (!formData.customCategory || !formData.customCategory.trim())
      ) {
        throw new Error("Please enter a category name");
      }

      const response = await fetch("/api/commands/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: formData.description,
          categoryId: categoryId,
          isPrivate: formData.isPrivate,
          code: formData.code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/private/command");
        router.refresh();
      } else {
        console.error("Failed to add command:", data.error);
        alert("Failed to add command. Please try again.");
      }
    } catch (error) {
      console.error("Error adding command:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const isCustom = value === "custom";
    setIsCustomCategory(isCustom);
    setFormData((prev) => ({
      ...prev,
      category_id: isCustom ? "" : value,
      customCategory: isCustom ? prev.customCategory : "",
    }));
  };

  return (
    <PageLayout title="Add New Command" backLink="/">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        <FormInput
          id="code"
          label="Code"
          value={formData.code}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, code: value }))
          }
          placeholder='e.g. Console.WriteLine("Hello, World!");'
          required
        />

        <FormInput
          id="description"
          label="Description"
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
          type="textarea"
          placeholder='e.g. Prints "Hello, World!" to the console'
          required
        />

        <CategorySelector
          categories={categories}
          isLoading={isLoadingCategories}
          selectedCategory={formData.categoryId}
          customCategory={formData.customCategory}
          isCustomCategory={isCustomCategory}
          onCategoryChange={handleCategoryChange}
          onCustomCategoryChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              customCategory: value,
            }))
          }
        />

        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPrivate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPrivate: e.target.checked,
                }))
              }
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="text-sm text-gray-700">
              Make this command private
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Private commands are only visible to you.
          </p>
          <p className="mt-1 text-sm text-red-500">
            This setting cannot be changed later.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Command"}
          </Button>
        </div>
      </form>
    </PageLayout>
  );
}
