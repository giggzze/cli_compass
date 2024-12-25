import {db} from "@/db";
import {categories} from "@/db/schema";
import {Category} from "@/lib/db.types";
import {eq} from "drizzle-orm";
import {CreateCategoryDto} from "@/lib/category.types";
import {NotFoundError, ValidationError} from "./errorService";

export class CategoryService {
	static async getAllCategories(): Promise<Category[]> {
		try {
			return await db
				.select()
				.from(categories);
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw error;
			}
			console.error("Error in getAllCategories:", error);
			throw new ValidationError("Failed to fetch categories");
		}
	}

	static async createCategory(
		newCategory: CreateCategoryDto
	): Promise<Category> {
		try {
			if (!newCategory.name || newCategory.name.trim().length === 0) {
				throw new ValidationError("Category name is required");
			}

			const existingCategory = await db
				.select()
				.from(categories)
				.where(eq(categories.name, newCategory.name))
				.limit(1);

			if (existingCategory.length > 0) {
				throw new ValidationError("Category with this name already exists");
			}

			const [createdCategory] = await db
				.insert(categories)
				.values({
					name: newCategory.name.trim(),
				})
				.returning();

			return {
				id: createdCategory.id,
				name: createdCategory.name,
			};
		} catch (error) {
			if (error instanceof ValidationError) {
				throw error;
			}
			console.error("Error in createCategory:", error);
			throw new ValidationError("Failed to create category");
		}
	}

	static async categoryExists(id: string): Promise<boolean> {
		try {
			if (!id) {
				throw new ValidationError("Category ID is required");
			}

			const category = await db
				.select()
				.from(categories)
				.where(eq(categories.id, id))
				.limit(1);

			return category.length > 0;
		} catch (error) {
			if (error instanceof ValidationError) {
				throw error;
			}
			console.error("Error in categoryExists:", error);
			throw new ValidationError("Failed to check category existence");
		}
	}

	// static async updateCategory(id: string, name: string): Promise<Category> {
	// 	try {
	// 		const [updatedCategory] = await db
	// 			.update(categories)
	// 			.set({
	// 				name,
	// 				updatedAt: new Date().toISOString(),
	// 			})
	// 			.where(eq(categories.id, id))
	// 			.returning();

	// 		return {
	// 			id: updatedCategory.id,
	// 			name: updatedCategory.name,
	// 		};
	// 	} catch (error) {
	// 		console.error("Error in updateCategory:", error);
	// 		throw new Error("Failed to update category");
	// 	}
	// }

	// static async deleteCategory(id: string): Promise<void> {
	// 	try {
	// 		await db.delete(categories).where(eq(categories.id, id));
	// 	} catch (error) {
	// 		console.error("Error in deleteCategory:", error);
	// 		throw new Error("Failed to delete category");
	// 	}
	// }
}
