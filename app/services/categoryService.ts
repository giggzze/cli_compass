import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError, ValidationError } from "./errorService";
import {ICategory, ICategoryIdentifier} from "@/app/models";

export class CategoryService {
	static async getAllCategories(): Promise<ICategory[]> {
		try {
			// retrieve and return all categories
			return await db.select().from(categories);
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw error;
			}
			console.error("Error in getAllCategories:", error);
			throw new ValidationError("Failed to fetch categories");
		}
	}

	static async createCategory(newCategory: string): Promise<ICategory> {
		try {
			// make sure name is not empty
			if (!newCategory) throw new ValidationError("Category name is required");

			// check if category already exists
			const exists = await this.categoryExists({
				name: newCategory,
			});
			if (exists.exists) {
				return exists.category![0];
			}

			// create new category
			const [createdCategory] = await db
				.insert(categories)
				.values({
					name: newCategory.trim(),
				})
				.returning();

			return createdCategory
		} catch (error) {
			if (error instanceof ValidationError) {
				throw error;
			}
			console.error("Error in createCategory:", error);
			throw new ValidationError("Failed to create category");
		}
	}

	static async categoryExists(identifier: ICategoryIdentifier) {
		try {
			// check what kind of identifier is provided
			if (!identifier.id && !identifier.name) {
				throw new ValidationError(
					"Either category ID or name is required"
				);
			}

			// get all categories
			const query = db.select().from(categories).limit(1);

			// check if category exists depending on identifier
			if (identifier.id) {
				query.where(eq(categories.id, identifier.id));
			} else if (identifier.name) {
				query.where(eq(categories.name, identifier.name));
			}

			const category = await query;
			if (category.length > 0)
				return { exists: true, category: category };
			return {
				exists: false,
			};
		} catch (error) {
			if (error instanceof ValidationError) {
				throw error;
			}
			console.error("Error in categoryExists:", error);
			throw new ValidationError("Failed to check category existence");
		}
	}
}
