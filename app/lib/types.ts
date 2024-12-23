export interface Category {
  id: string;
  name: string;
}

export interface Command {
  name: string;
  description: string;
  usage?: string;
  isPrivate: boolean;
  categoryId: string;
  owner?: string;
}

export interface GetCommand extends Command {
  id: string;
  category?: Category;
  isFavorite?: boolean;
  lastUsed?: string;
}

export interface CreateCommand extends Omit<Command, 'id'> {
  tags?: string[];
}
