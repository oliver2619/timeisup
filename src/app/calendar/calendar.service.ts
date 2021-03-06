
import {Injectable} from '@angular/core';
import {CalendarJson, CalendarDayJson, CalendarEventJson} from 'src/app/calendar/calendar';
import {StoreService} from 'src/app/common/store.service';
import {SettingsService} from 'src/app/settings/settings.service';
import {TimeService} from 'src/app/common/time.service';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    private static readonly VERSION = 1;

    private _data: CalendarJson;

    get bonusTime(): number {
        return this._data.roundingBonus;
    }

    set bonusTime(time: number) {
        this._data.roundingBonus = time;
        this.save();
    }

    constructor(private storeService: StoreService, private settingsService: SettingsService, private timeService: TimeService) {
        this._data = this.storeService.load('calendar');
        if (this._data === undefined) {
            this._data = {
                version: CalendarService.VERSION,
                month: {},
                roundingBonus: 0
            };
            this.save();
        } else if (this._data.version === undefined) {
            this._data.version = CalendarService.VERSION;
            if (this._data.roundingBonus === undefined) {
                this._data.roundingBonus = 0;
            }
            this.save();
        }
    }

    deleteDay(month: number, day: number): void {
        delete this._data.month[month].day[day];
        this.save();
    }

    deleteMonth(month: number): void {
        delete this._data.month[month];
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

    getNextDay(month: number, day: number): number | undefined {
        const m = this._data.month[month];
        if (m === undefined) {
            return undefined;
        }
        const previousDays = Object.keys(m.day).map(d => Number(d)).filter(d => d > day);
        return previousDays.length > 0 ? previousDays[0] : undefined;
    }

    getPreviousDay(month: number, day: number): number | undefined {
        const m = this._data.month[month];
        if (m === undefined) {
            return undefined;
        }
        const previousDays = Object.keys(m.day).map(d => Number(d)).filter(d => d < day);
        return previousDays.length > 0 ? previousDays[previousDays.length - 1] : undefined;
    }

    getTotalSumByMonth(month: number): number {
        let ret = 0;
        const m = this._data.month[month];
        if (m !== undefined) {
            Object.values(m.day).forEach((v: CalendarDayJson) => ret += v.accountableWorkingTime);
        }
        return ret;
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
        entry.startWork = startTime;
        entry.endWork = endTime;
        entry.paused = pauseDuration;
        const time = endTime - startTime - pauseDuration + this._data.roundingBonus;
        entry.accountableWorkingTime = this.settingsService.adjustTotalTime(time);
        this._data.roundingBonus = time - entry.accountableWorkingTime;
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
                accountableWorkingTime: 0,
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
