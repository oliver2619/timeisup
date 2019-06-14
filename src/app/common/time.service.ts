
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TimeService {

    constructor() {}

    durationToDate(duration: number): Date {
        const ret = new Date();
        ret.setHours(0);
        ret.setMinutes(0);
        ret.setSeconds(0);
        ret.setMilliseconds(0);
        ret.setTime(ret.getTime() + duration);
        return ret;
    }
    
    timeToDate(time: number): Date {
        const ret = new Date();
        ret.setTime(time);
        return ret;
    }
}
