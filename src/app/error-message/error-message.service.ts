import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorMessageService {

    private _observable: Observable<string>;
    private _subscribers: Subscriber<string>[] = [];

    get observable(): Observable<string> {
        return this._observable;
    }

    constructor() {
        this._observable = new Observable(subscriber => {
            this._subscribers.push(subscriber);
            return () => {
                this._subscribers = this._subscribers.filter(s => s !== subscriber);
            };
        });
    }

    error(message: string, reason?: Error): void {
        if (reason !== undefined)
            console.error(reason);
        this._subscribers.forEach(s => s.next(message));
    }
}
