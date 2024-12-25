import {db} from "@/db";
import {categories} from "@/db/schema";
import {Category} from "@/lib/db.types";
import {eq} from "drizzle-orm";
import {CategoryIdentifier, CreateCategoryDto} from "@/lib/category.types";
import {NotFoundError, ValidationError} from "./errorService";

export class CategoryService {
	static async getAllCategories(): Promise<Category[]> {
		try {
			// retrieve and return all categories
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
			// make sure name is not empty
			if (!newCategory.name || newCategory.name.trim().length === 0) {
				throw new ValidationError("Category name is required");
			}

			// check if category already exists
			const exists = await CategoryService.categoryExists({ name: newCategory.name });
			if (exists) {
				throw new ValidationError("Category with this name already exists");
			}

			// create new category
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

	static async categoryExists(identifier: CategoryIdentifier): Promise<boolean> {
		try {
			// check what kind of identifier is provided
			if (!identifier.id && !identifier.name) {
				throw new ValidationError("Either category ID or name is required");
			}

			// get all categories
			const query = db
				.select()
				.from(categories)
				.limit(1);

			// check if category exists depending on identifier
			if (identifier.id) {
				query.where(eq(categories.id, identifier.id));
			} else if (identifier.name) {
				query.where(eq(categories.name, identifier.name));
			}

			const category = await query;
			return category.length > 0;
		} catch (error) {
			if (error instanceof ValidationError) {
				throw error;
			}
			console.error("Error in categoryExists:", error);
			throw new ValidationError("Failed to check category existence");
		}
	}

	
}
