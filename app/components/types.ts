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
	createdAt?: Date;
	updatedAt?: Date;
}
