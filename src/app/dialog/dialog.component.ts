
import {Component, ViewChild, ElementRef, Input} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subscriber} from 'rxjs';

export interface DialogContent {
    readonly valid: boolean;
}

export interface Dialog {
    title: string;
    
    show(): Observable<boolean>;
}

@Component({
    selector: 't-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements Dialog {

    @ViewChild('dialog')
    dialog: ElementRef;

    @Input()
    title: string;

    @Input()
    content: DialogContent;
    
    private _modalRef: NgbModalRef;
    private _subscriber: Subscriber<boolean>;

    get enabled(): boolean {
        return this.content.valid;
    }

    constructor(private modalService: NgbModal) {}

    show(): Observable<boolean> {
        this._modalRef = this.modalService.open(this.dialog, {
            backdrop: 'static',
            centered: true,
            size: 'lg',
            keyboard: true
        });
        return new Observable(s => {
            this._subscriber = s;
        });
    }

    cancel(): void {
        this._modalRef.close();
        this._subscriber.next(false);
    }

    ok(): void {
        this._modalRef.close();
        this._subscriber.next(true);
    }
}
