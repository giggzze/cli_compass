import { db } from "@/db";
import { NotFoundError, ValidationError } from "./errorService";
import {Category, CategoryInsert} from "@/types/STT";
import {supabase} from "@/supabase";

export class CategoryService {
	static async getAllCategories(): Promise<Category[]> {
		try {
			// retrieve and return all categories
			const {data} = await supabase
				.from("categories")
				.select();
			return data;
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw error;
			}
			console.error("Error in getAllCategories:", error);
			throw new ValidationError("Failed to fetch categories");
		}
	}

	static async createCategory(newCategory: string): Promise<Category> {
		try {
			// make sure name is not empty
			if (!newCategory) throw new ValidationError("Category name is required");

			// check if category already exists
			const exists = await this.categoryExists({name: newCategory} as CategoryInsert);

			if (exists) {
				const {data} = await supabase.from("categories").select().eq("name", newCategory).single();
				return data as Category;
			}

			// create new category
			const {data , error }= await supabase 
				.from("categories")
				.insert({name: newCategory} as CategoryInsert)
				.select()
				.single();

			if (error) {
				console.error("Error in createCategory:", error);
				throw new ValidationError("Failed to create category");
			}

			return data as Category;
		} catch (error) {
			if (error instanceof ValidationError) {
				throw error;
			}
			console.error("Error in createCategory:", error);
			throw new ValidationError("Failed to create category");
		}
	}

	static async categoryExists(category: CategoryInsert) {
		try {
			// check what kind of identifier is provided
			if (!category) {
				throw new ValidationError(
					"Either category ID or name is required"
				);
			}

			// get all categories
			const { data } = await supabase
				.from("categories")
				.select("id")
				.eq("name", category.name)
				.maybeSingle();

			return !!data

		} catch (error) {
			if (error instanceof ValidationError) {
				throw error;
			}
			console.error("Error in categoryExists:", error);
			throw new ValidationError("Failed to check category existence");
		}
	}
}
