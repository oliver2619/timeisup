import {Injectable} from '@angular/core';
import {EventListJson, EventJson} from 'src/app/events/event';
import {StoreService} from 'src/app/common/store.service';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    private _data: EventListJson;

    get all(): EventJson[] {
        return this._data.events;
    }

    constructor(private storeService: StoreService) {
        this._data = this.storeService.load('events');
        if (this._data === undefined) {
            this._data = {
                nextId: 1,
                events: []
            };
        }
    }

    add(name: string): EventJson {
        if (this._data.events.find(c => c.name === name) !== undefined)
            throw new Error(`Event with name ${name} already exists.`);
        const newEl: EventJson = {
            id: this._data.nextId,
            name: name
        };
        this._data.events.push(newEl);
        this._data.nextId++;
        this.save();
        return newEl;
    }

    deleteById(id: number): void {
        this._data.events = this._data.events.filter(c => c.id !== id);
        this.save();
    }

    getById(id: number): EventJson | undefined {
        return this._data.events.find(c => c.id === id);
    }

    getByName(name: string): EventJson | undefined {
        return this._data.events.find(c => c.name === name);
    }

    getEventNameById(id: number, defaultName?: string): string {
        const ev = this.getById(id);
        return ev !== undefined ? ev.name : defaultName;
    }

    rename(id: number, name: string): void {
        const ev = this.getById(id);
        if (ev !== undefined && ev.name !== name) {
            const found = this.getByName(name);
            if (found !== undefined)
                throw new Error(`Event with name ${name} already exists.`);
            ev.name = name;
        }
    }

    private save(): void {
        this.storeService.save('events', this._data);
    }
}
