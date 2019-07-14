
import {Injectable} from '@angular/core';
import {StoreService} from 'src/app/common/store.service';
import {SettingsJson, WorkSettingsJson} from 'src/app/settings/settings';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private _data: SettingsJson;

    constructor(private storeService: StoreService) {
        this._data = this.storeService.load('settings');
        if (this._data === undefined) {
            this._data = {
                work: {
                    hoursPerWeek: 40,
                    workingRate: 1,
                    granularity: 30,
                    maxHoursPerDay: 0,
                    mo_fr: true,
                    sa: false,
                    su: false
                }
            };
        }
    }

    get maxTimePerDay(): number {
        return this._data.work.maxHoursPerDay * 60 * 60 * 1000;
    }

    get timePerDay(): number {
        const s = this._data.work;
        let days = 0;
        if (s.mo_fr)
            days += 5;
        if (s.sa)
            ++days;
        if (s.su)
            ++days;
        return s.hoursPerWeek * 60 * 60 * 1000 / days;
    }

    get work(): WorkSettingsJson {return this._data.work;}

    set work(settings: WorkSettingsJson) {
        this._data.work = settings;
        this.save();
    }

    adjustWithGranularity(time: number): number {
        const g = this._data.work.granularity * 60 * 1000;
        return Math.floor(time / g) * g;
    }

    adjustTotalTime(time: number): number {
        const ret = this.adjustWithGranularity(time);
        const max = this._data.work.maxHoursPerDay * 60 * 60 * 1000;
        if (ret > max && max > 0) {
            return max;
        }
        return ret;
    }

    private save(): void {this.storeService.save('settings', this._data);}
}
