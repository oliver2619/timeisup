import {Component, OnInit, OnDestroy} from '@angular/core';
import {ErrorMessageService} from 'src/app/error-message/error-message.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 't-error-message',
    templateUrl: './error-message.component.html',
    styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit, OnDestroy {

    private _list: string[] = [];
    private _subscription: Subscription;
    
    get errors(): string [] {
        return this._list;
    }
    
    constructor(private errorMessageService: ErrorMessageService) {}

    deleteByIndex(index: number): void {
        this._list.splice(index, 1);
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }   
     
    ngOnInit(): void {
        this._subscription = this.errorMessageService.observable.subscribe(e => this._list.push(e));
    }

}
