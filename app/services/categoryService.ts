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
    const existingCategory = await this.categoryExists(newCategory);
    if (existingCategory) return existingCategory;

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: newCategory } as CategoryInsert)
      .select()
      .single();

    if (error) {
      console.error("categoryService.createCategory error:", error);
      throw new Error(error.message);
    }

    return data as Category;
  }

  static async categoryExists(name: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .select()
      .eq("name", name)
      .maybeSingle();

    if (error) return null;
    return data;
  }
}
