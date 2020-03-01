import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    static readonly PREFIX = 'timeisup';
    
    constructor() {}

    load<T>(key: string): T | undefined {
        let str = window.localStorage.getItem(`${StoreService.PREFIX}:${key}`);
        if(str === null) {
            str = window.localStorage.getItem(key);
            if(str !== null) {
                window.localStorage.setItem(`${StoreService.PREFIX}:${key}`, str);
                window.localStorage.removeItem(key);
            }
        }
        if (str === null)
            return undefined;
        return JSON.parse(str);
    }

    remove(key: string): void {
        window.localStorage.removeItem(`${StoreService.PREFIX}:${key}`);
    }
    
    save(key: string, data: any): void {
        window.localStorage.setItem(`${StoreService.PREFIX}:${key}`, JSON.stringify(data));
    }
}
