import {Injectable} from '@angular/core';
import {QuestionMode, QuestionResult, MessageBox} from 'src/app/message-box/message-box';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageBoxService {

    private messageBox: MessageBox;

    constructor() {}

    question(message: string, mode: QuestionMode, title: string): Observable<QuestionResult> {
        return this.messageBox.question(message, mode, title);
    }

    registerComponent(messageBox: MessageBox): void {
        this.messageBox = messageBox;
    }
}
