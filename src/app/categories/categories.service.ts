
import {Injectable} from '@angular/core';
import {CategoryListJson, CategoryJson} from 'src/app/categories/category';
import {StoreService} from 'src/app/common/store.service';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    private _data: CategoryListJson;

    get all(): CategoryJson[] {
        return this._data.categories;
    }

    constructor(private storeService: StoreService) {
        this._data = this.storeService.load('categories');
        if (this._data === undefined) {
            this._data = {
                nextId: 1,
                categories: []
            };
        }
    }

    add(name: string): CategoryJson {
        if (this._data.categories.find(c => c.name === name) !== undefined)
            throw new Error(`Category with name ${name} already exists.`);
        const newEl: CategoryJson = {
            id: this._data.nextId,
            name: name
        };
        this._data.categories.push(newEl);
        this._data.nextId++;
        this.save();
        return newEl;
    }

    deleteById(id: number): void {
        this._data.categories = this._data.categories.filter(c => c.id !== id);
        this.save();
    }

    getById(id: number): CategoryJson | undefined {
        return this._data.categories.find(c => c.id === id);
    }
    
    getByName(name: string): CategoryJson | undefined {
        return this._data.categories.find(c => c.name === name);
    }

    rename(id: number, name: string): void {
        const cat = this.getById(id);
        if (cat !== undefined && cat.name !== name) {
            const found = this.getByName(name);
            if(found !== undefined)
                throw new Error(`Category with name ${name} already exists.`);
            cat.name = name;
        }
    }
    
    private save(): void {
        this.storeService.save('categories', this._data);
    }
}
