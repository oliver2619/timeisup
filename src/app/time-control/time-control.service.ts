
import {Injectable} from '@angular/core';
import {StoreService} from 'src/app/common/store.service';
import {TimeControlJson, TimeControlEventJson, TimeControlEventType} from 'src/app/time-control/time-control';

@Injectable({
    providedIn: 'root'
})
export class TimeControlService {

    private _data: TimeControlJson;

    get endWork(): number {return this._data.endWork;}

    set endWork(time: number) {
        this._data.endWork = time;
        this.save();
    }

    get events(): TimeControlEventJson[] {
        return this._data.events.filter(e => true);
    }

    get isEndWorkValid(): boolean {
        if (this._data.endWork === undefined)
            return false;
        if (this._data.endWork <= this._data.startWork)
            return true;
        return this._data.events.find(e => e.start > this._data.endWork || e.end > this._data.endWork) === undefined;
    }

    get isPaused(): boolean {return this._data.events.find(e => e.type === TimeControlEventType.PAUSE && e.end === undefined) !== undefined;}

    get pausedTime(): number {
        let ret = 0;
        this._data.events.forEach(e => {
            if (e.type === TimeControlEventType.PAUSE) {
                if (e.end !== undefined)
                    ret += e.end - e.start;
                else
                    ret += this.now() - e.start;
            }
        });
        return ret;
    }

    get startWork(): number {return this._data.startWork;}

    set startWork(time: number) {
        this._data.startWork = time;
        this.save();
    }

    get valid(): boolean {
        if (this._data.startWork === undefined)
            return false;
        if (this._data.endWork === undefined)
            return false;
        if (this._data.startWork > this._data.endWork)
            return false;
        if (this._data.events.length > 0) {
            let ev = this._data.events[0];
            if (ev.start < this._data.startWork)
                return false;
            ev = this._data.events[this._data.events.length - 1];
            if (ev.start > this._data.endWork || ev.end > this._data.endWork)
                return false;
        }
        const rangedEvents = this._data.events.filter(e => e.end !== undefined);
        for (let i = 1; i < rangedEvents.length; ++i) {
            if (rangedEvents[i].start < rangedEvents[i - 1].end)
                return false;
        }
        return true;
    }

    get task(): number {
        const found = this._data.events.find(ev => ev.type === TimeControlEventType.TASK && ev.end === undefined);
        return found !== undefined ? found.id : 0;
    }

    set task(id: number) {
        const now = this.now();
        if (this._data.startWork === undefined || this._data.endWork !== undefined)
            return;
        this.endLastEvent(now);
        if (id !== 0) {
            this._data.events.push({
                type: TimeControlEventType.TASK,
                start: now,
                id: id
            });
        }
        this.save();
    }

    get workedTime(): number {
        if (this._data.startWork !== undefined) {
            if (this._data.endWork === undefined)
                return this.now() - this._data.startWork - this.pausedTime;
            else
                return this._data.endWork - this._data.startWork - this.pausedTime;
        } else
            return 0;
    }

    constructor(private storeService: StoreService) {
        this._data = this.storeService.load('timeControl');
        if (this._data === undefined)
            this.reset();
    }

    calculateTasks(): {[key: number]: number} {
        const ret: {[key: number]: number} = {};
        this._data.events.forEach(ev => {
            if (ev.type === TimeControlEventType.TASK) {
                const amount = ev.end - ev.start;
                const current = ret[ev.id];
                if (current === undefined)
                    ret[ev.id] = amount;
                else
                    ret[ev.id] = current + amount;
            }
        });
        return ret;
    }

    isEventValid(ev: number): boolean {
        const event = this._data.events[ev];
        if (event.start < this._data.startWork)
            return false;
        if (event.type === TimeControlEventType.EVENT)
            return true;
        for (let i = 0; i < ev; ++i) {
            const ev2 = this._data.events[i];
            if (ev2.start > event.start || ev2.end > event.start)
                return false;
        }
        return event.end === undefined || event.end > event.start;
    }

    logEvent(event: number): void {
        const now = this.now();
        this._data.events.push({
            type: TimeControlEventType.EVENT,
            start: now,
            id: event
        });
    }

    moveEventByIndex(eventIndex: number, start: number, end: number): void {
        this._data.events[eventIndex].start = start;
        this._data.events[eventIndex].end = end;
        this._data.events.sort((e1, e2) => e1.start - e2.start);
        this.save();
    }

    pause(): void {
        if (!this.isPaused) {
            const now = this.now();
            this.endLastEvent(now);
            this._data.events.push({
                type: TimeControlEventType.PAUSE,
                start: now
            });
            this.save();
        }
    }

    removeEventByIndex(eventIndex: number): void {
        this._data.events.splice(eventIndex, 1);
        this.save();
    }

    reset(): void {
        this._data = {
            events: []
        };
        this.save();
    }

    resume(): void {
        if (this.isPaused) {
            const now = this.now();
            this.endLastEvent(now);
            this.save();
        }
    }

    start(): void {
        if (this._data.startWork === undefined) {
            const now = this.now();
            this._data.startWork = now;
            this.save();
        }
    }

    stop(): void {
        this.resume();
        if (this._data.startWork !== undefined) {
            const now = this.now();
            this._data.endWork = now;
            this.endLastEvent(now);
            this.save();
        }
    }

    private endLastEvent(time: number): void {
        const last = this._data.events.find(e => (e.type === TimeControlEventType.PAUSE || e.type === TimeControlEventType.TASK) && e.end === undefined);
        if (last !== undefined)
            last.end = time;
    }

    private now(): number {
        const ret = new Date();
        ret.setSeconds(0, 0);
        return ret.getTime();
    }

    private save(): void {
        this.storeService.save('timeControl', this._data);
    }
}
