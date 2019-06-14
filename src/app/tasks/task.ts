

export interface TaskJson {
    id: number;
    
    name: string;
    
    categories: number[];
}

export interface TaskListJson {
    
    nextId: number;
    
    tasks: TaskJson[];
}