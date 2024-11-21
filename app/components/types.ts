export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Command {
  id: number;
  name: string;
  description: string;
  usage: string;
  category: Category;
  tags: Tag[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}
