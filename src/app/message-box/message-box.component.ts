
import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {NgbModalRef, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {QuestionResult, QuestionMode} from 'src/app/message-box/message-box';
import {MessageBoxService} from 'src/app/message-box/message-box.service';

@Component({
    selector: 't-message-box',
    templateUrl: './message-box.component.html',
    styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {

    @ViewChild('element')
    element: ElementRef;

    message: string;
    title: string;
    cancelVisible: boolean;
    noVisible: boolean;
    okVisible: boolean;
    yesVisible: boolean;

    private _modalRef: NgbModalRef;
    private _subscriber: Subscriber<QuestionResult>;

    constructor(private modalService: NgbModal, private messageBoxService: MessageBoxService) {}

    ngOnInit(): void {
        this.messageBoxService.registerComponent(this);
    }

    question(message: string, mode: QuestionMode, title: string): Observable<QuestionResult> {
        this.message = message;
        this.title = title;
        this.setMode(mode);
        this._modalRef = this.modalService.open(this.element, {
            backdrop: 'static',
            centered: true,
            size: 'sm',
            keyboard: true
        });
        return new Observable(s => {
            this._subscriber = s;
        });
    }

    cancel(): void {
        this._modalRef.close();
        this._subscriber.next(QuestionResult.CANCEL);
    }

    no(): void {
        this._modalRef.close();
        this._subscriber.next(QuestionResult.NO);
    }

    yes(): void {
        this._modalRef.close();
        this._subscriber.next(QuestionResult.YES);
    }

    ok(): void {
        this._modalRef.close();
        this._subscriber.next(QuestionResult.YES);
    }

    private setMode(mode: QuestionMode): void {
        this.cancelVisible = mode === QuestionMode.OK_CANCEL || mode === QuestionMode.YES_NO_CANCEL;
        this.noVisible = mode === QuestionMode.YES_NO || mode === QuestionMode.YES_NO_CANCEL;
        this.okVisible = mode === QuestionMode.OK_CANCEL;
        this.yesVisible = mode === QuestionMode.YES_NO || mode === QuestionMode.YES_NO_CANCEL;
    }
}
