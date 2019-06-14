
export interface CategoryJson {
    id: number;

    name: string;
}

export interface CategoryListJson {

    nextId: number;

    categories: CategoryJson[];

}