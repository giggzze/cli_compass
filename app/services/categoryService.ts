import { db } from "@/db";
import { categories } from "@/db/schema";
import { Category } from "@/lib/types";
import { eq } from "drizzle-orm";

export class CategoryService {
	static async getAllCategories(): Promise<Category[]> {
		try {
			// Select all categories from the database
			const allCategories: Category[] = await db
				.select({
					id: categories.id,
					name: categories.name,
				})
				.from(categories);

			return allCategories;
		} catch (error) {
			console.error("Error in getAllCategories:", error);
			throw new Error("Failed to fetch categories");
		}
	}

	static async createCategory(name: string): Promise<Category> {
		try {
			// Insert a new category into the database
			const [newCategory] = await db
				.insert(categories)
				.values({
					name,
				})
				.returning();

			return {
				id: newCategory.id,
				name: newCategory.name,
			};
		} catch (error) {
			console.error("Error in createCategory:", error);
			throw new Error("Failed to create category");
		}
	}

	static async categoryExists(id: string): Promise<boolean> {
		try {
			// Check if a category with the given name already exists in the database
			const category = await db
				.select()
				.from(categories)
				.where(eq(categories.id, id))
				.limit(1);
				
				if (category.length === 0) return false;
				return true;
		} catch (error) {
			console.error("Error in categoryExists:", error);
			throw new Error("Failed to check category existence");
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
