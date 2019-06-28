
import {Injectable} from '@angular/core';
import {StoreService} from 'src/app/common/store.service';
import {TaskListJson, TaskJson} from 'src/app/tasks/task';

@Injectable({
    providedIn: 'root'
})
export class TasksService {

    private _data: TaskListJson;

    get all(): TaskJson[] {
        return this._data.tasks;
    }

    constructor(private storeService: StoreService) {
        this._data = this.storeService.load('tasks');
        if (this._data === undefined) {
            this._data = {
                nextId: 1,
                tasks: []
            };
        }
    }

    add(name: string): TaskJson {
        if (this._data.tasks.find(c => c.name === name) !== undefined)
            throw new Error(`Task with name ${name} already exists.`);
        const newEl: TaskJson = {
            id: this._data.nextId,
            name: name,
            categories: []
        };
        this._data.tasks.push(newEl);
        this._data.nextId++;
        this.save();
        return newEl;
    }

    deleteById(id: number): void {
        this._data.tasks = this._data.tasks.filter(c => c.id !== id);
        this.save();
    }

    deleteCategory(id: number): void {
        this._data.tasks.forEach(t => t.categories = t.categories.filter(c => c !== id));
        this.save();
    }
    
    edit(id: number, name: string, categories: number[]): void {
        const task = this.getById(id);
        if (task !== undefined) {
            if (task.name !== name) {
                const found = this.getByName(name);
                if (found !== undefined)
                    throw new Error(`Task with name ${name} already exists.`);
            }
            task.name = name;
            task.categories = categories.map(v => v);
            this.save();
        }
    }

    getById(id: number): TaskJson | undefined {
        return this._data.tasks.find(c => c.id === id);
    }

    getByName(name: string): TaskJson | undefined {
        return this._data.tasks.find(c => c.name === name);
    }

    getTaskNameById(id: number, defaultName?: string): string {
        const task = this.getById(id);
        return task !== undefined ? task.name : defaultName;
    }
    
    private save(): void {
        this.storeService.save('tasks', this._data);
    }
}
