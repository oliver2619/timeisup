
import {Injectable} from '@angular/core';
import {CalendarJson, CalendarDayJson, CalendarEventJson} from 'src/app/calendar/calendar';
import {StoreService} from 'src/app/common/store.service';
import {SettingsService} from 'src/app/settings/settings.service';
import {TimeService} from 'src/app/common/time.service';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    private _data: CalendarJson;

    get bonusTime(): number {
        return this._data.roundingBonus;
    }
    
    constructor(private storeService: StoreService, private settingsService: SettingsService, private timeService: TimeService) {
        this._data = this.storeService.load('calendar');
        if (this._data === undefined) {
            this._data = {
                month: {},
                roundingBonus: 0
            };
            this.save();
        } else {
            if (this._data.roundingBonus === undefined) {
                this._data.roundingBonus = 0;
                this.save();
            }
        }
    }

    deleteDay(month: number, day: number): void {
        delete this._data.month[month].day[day];
        this.save();
    }

    getAllEntriesByMonth(month: number): CalendarDayJson[] {
        const ret: CalendarDayJson[] = [];
        const monthJson = this._data.month[month];
        if (monthJson !== undefined) {
            for (let day in monthJson.day) {
                ret.push(monthJson.day[parseInt(day)]);
            }
        }
        return ret;
    }

    getAllMonthsAsDate(): Date[] {
        const ret: Date[] = [];
        for (let m = 0; m < 12; ++m) {
            const d = new Date();
            d.setMonth(m);
            ret.push(d);
        }
        return ret;
    }

    getByDay(month: number, day: number): CalendarDayJson | undefined {
        const m = this._data.month[month];
        if (m === undefined) {
            return undefined;
        }
        return m.day[day];
    }

    isTaskUsed(id: number): boolean {
        for (let m in this._data.month) {
            const days = this._data.month[parseInt(m)].day;
            for (let d in days) {
                for (let t in days[parseInt(d)].tasks) {
                    if (parseInt(t) === id)
                        return true;
                }
            }
        }
        return false;
    }

    logTasksAndEvents(startTime: number, tasks: {[key: number]: number}, events: CalendarEventJson[]): void {
        const startDate = this.timeService.timeToDate(startTime);
        const entry = this.getEntryForDate(startDate);
        entry.tasks = {};
        for (let task in tasks) {
            entry.tasks[parseInt(task)] = this.settingsService.adjustWithGranularity(tasks[task]);
        }
        entry.events = events.filter(e => true);
        this.save();
    }

    logWork(startTime: number, endTime: number, pauseDuration: number): void {
        const startDate = this.timeService.timeToDate(startTime);
        const entry = this.getEntryForDate(startDate);
        entry.startWork = this.settingsService.adjustWithGranularity(startTime);
        entry.endWork = this.settingsService.adjustWithGranularity(endTime);
        entry.paused = this.settingsService.adjustWithGranularity(pauseDuration);
        this.save();
    }

    private getEntryForDate(date: Date): CalendarDayJson {
        const month = date.getMonth();
        let monthJson = this._data.month[month];
        if (monthJson === undefined) {
            monthJson = {
                day: {}
            };
            this._data.month[month] = monthJson;
        }
        const day = date.getDate();
        let dayJson = monthJson.day[day];
        if (dayJson === undefined) {
            dayJson = {
                startWork: 0,
                endWork: 0,
                paused: 0,
                tasks: {},
                events: [],
                comments: {}
            };
            monthJson.day[day] = dayJson;
        }
        return dayJson;
    }

    private save(): void {
        this.storeService.save('calendar', this._data);
    }
}
