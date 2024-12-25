// interfaces for categories
export interface CreateCategoryDto {
    name: string;
}

export interface CategoryIdentifier {
    id?: string;
    name?: string;
}

export interface CategoryResponse {
    success: boolean;
    data?: any;
    error?: string;
}
