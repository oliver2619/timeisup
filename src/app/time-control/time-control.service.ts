
import {Injectable} from '@angular/core';
import {StoreService} from 'src/app/common/store.service';
import {TimeControlJson} from 'src/app/time-control/time-control';

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

    get paused(): number {
        if (this._data.startPause !== undefined)
            return this._data.paused + Date.now() - this._data.startPause;
        else
            return this._data.paused;
    }

    set paused(time: number) {
        this._data.paused = time;
        if (this._data.startPause !== undefined)
            this._data.startPause = Date.now();
        this.save();
    }

    get startPause(): number {return this._data.startPause;}

    get startWork(): number {return this._data.startWork;}

    set startWork(time: number) {
        this._data.startWork = time;
        this.save();
    }

    get task(): number {
        return this._data.currentTask;
    }

    set task(id: number) {
        const now = Date.now();
        this.logTask(now);
        this._data.currentTask = id;
        this._data.startTask = now;
        if (this._data.tasks[id] === undefined)
            this._data.tasks[id] = 0;
        this.save();
    }

    get tasks(): {[key: number]: number} {
        const ret = {};
        for (let k in this._data.tasks) {
            const id = parseInt(k);
            if (this._data.currentTask === id && this._data.startTask !== undefined) {
                ret[id] = this._data.tasks[id] + Date.now() - this._data.startTask;
            } else
                ret[id] = this._data.tasks[id];
        }
        return ret;
    }

    get worked(): number {
        if (this._data.startWork !== undefined) {
            if (this._data.endWork === undefined)
                return Date.now() - this._data.startWork - this.paused;
            else
                return this._data.endWork - this._data.startWork - this.paused;
        } else
            return this.paused;
    }

    constructor(private storeService: StoreService) {
        this._data = this.storeService.load('timeControl');
        if (this._data === undefined)
            this.reset();
    }

    pause(): void {
        if (this._data.startPause === undefined) {
            const now = Date.now();
            this._data.startPause = now;
            this.logTask(now);
            this._data.startTask = undefined;
            this.save();
        }
    }

    reset(): void {
        this._data = {
            paused: 0,
            currentTask: 0,
            tasks: {}
        };
        this.save();
    }

    resume(): void {
        if (this._data.startPause !== undefined) {
            const now = Date.now();
            this._data.paused += now - this._data.startPause;
            this._data.startPause = undefined;
            this._data.startTask = now;
            this.save();
        }
    }

    start(): void {
        if (this._data.startWork === undefined) {
            const now = Date.now();
            this._data.startWork = now;
            this._data.startTask = now;
            this.save();
        }
    }

    stop(): void {
        this.resume();
        if (this._data.startWork !== undefined) {
            const now = Date.now();
            this._data.endWork = now;
            this.logTask(now);
            this._data.startTask = undefined;
            this.save();
        }
    }

    private save(): void {
        this.storeService.save('timeControl', this._data);
    }

    private logTask(time: number): void {
        if (this._data.startTask !== undefined && this._data.startTask < time) {
            const worked = time - this._data.startTask;
            const workedForTask = this._data.tasks[this._data.currentTask];
            if (workedForTask === undefined)
                this._data.tasks[this._data.currentTask] = worked;
            else
                this._data.tasks[this._data.currentTask] = worked + workedForTask;
        }
    }
}
