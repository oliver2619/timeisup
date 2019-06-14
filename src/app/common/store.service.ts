import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    constructor() {}

    load<T>(key: string): T | undefined {
        const str = window.localStorage.getItem(key);
        if (str === null)
            return undefined;
        return JSON.parse(str);
    }

    remove(key: string): void {
        window.localStorage.removeItem(key);
    }
    
    save(key: string, data: any): void {
        window.localStorage.setItem(key, JSON.stringify(data));
    }
}
