import { Category, CategoryInsert } from "@/types/STT";
import { supabase } from "@/supabase";

export class CategoryService {
  /**
   *
   * @returns return all the categories stored in the DB
   */
  static async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from("categories").select();

    if (error) return [] as Category[];

    return data;
  }

  /**
   *
   * @param newCategory Category that should be created
   * @returns  The new Category after it has been stored in the DB
   */
  static async createCategory(newCategory: string): Promise<Category> {
    // check if category already exists
    const existingCategory = await this.categoryExists({
      name: newCategory,
    } as CategoryInsert);

    if (existingCategory) {
      return existingCategory;
    }

    // create new category
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: newCategory } as CategoryInsert)
      .select()
      .single();

    if (error) return {} as Category;

    return data as Category;
  }

  static async categoryExists(category: CategoryInsert) {
    const { data, error } = await supabase
      .from("categories")
      .select()
      .eq("name", category.name)
      .maybeSingle();

    if (error) return {} as Category;

    return data;
  }
}
