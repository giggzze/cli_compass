import { categories } from "@/db/schema";

export type ICategory = typeof categories.$inferSelect;

export interface ICreateCategory {
    name: string;
}

export interface ICategoryIdentifier {
    id?: string;
    name?: string;
}

export interface ICategoryResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export interface ICategoryFormData {
	name: string;
}
