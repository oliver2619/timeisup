
import {Observable} from "rxjs";

export interface MessageBox {
    question(message: string, mode: QuestionMode, title: string): Observable<QuestionResult>;
}

export enum QuestionMode {
    YES_NO, OK_CANCEL, YES_NO_CANCEL
}

export enum QuestionResult {
    YES = 0, OK = 0, NO, CANCEL
}

