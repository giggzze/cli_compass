"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormInput from "../components/FormInput";
import PageLayout from "./compoents/PageLayout";
import CategorySelector from "./compoents/CategorySelector";
import { Button } from "../components/ui/button";

export default function AddCommand() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    customCategory: "",
    tags: [] as string[],
    is_private: true,
  });
  // const [selectedTag, setSelectedTag] = useState('');
  // const [isCustomTag, setIsCustomTag] = useState(false);
  // const [customTag, setCustomTag] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  // const [availableTags, setAvailableTags] = useState<Array<{ id: string; name: string }>>([]);
  // const [isLoadingTags, setIsLoadingTags] = useState(true);

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
              category_id: categoriesData.data[0].id,
            }));
          }
        }

        // Fetch tags
        // const tagsResponse = await fetch('/api/tags');
        // const tagsData = await tagsResponse.json();
        // if (tagsData.success) {
        //   setAvailableTags(tagsData.data);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
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
      // If it's a custom category or there are no categories, create a new one
      let categoryId = formData.category_id;
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

      const response = await fetch("/api/commands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category_id: categoryId,
          tags: formData.tags,
          is_private: formData.is_private,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/commands");
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
    <PageLayout title="Add New Command" backLink="/">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        <FormInput
          id="name"
          label="Command Name"
          value={formData.name}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, name: value }))
          }
          placeholder="e.g., ls"
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
              checked={formData.is_private}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_private: e.target.checked,
                }))
              }
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="text-sm text-gray-700">
              Make this command private
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Private commands are only visible to you
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
