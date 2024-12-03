export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Command {
  id: string;
  name: string;
  description: string;
  usage: string;
  category: Category;
  tags: Tag[];
  isFavorite: boolean;
  notes?: string;
  lastUsed?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface CommandListProps {
  commands: Command[];
  onToggleFavorite: (id: string) => void;
}

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export interface TagsFilterProps {
  tags: Tag[];
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
}

export interface CommandSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
