import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {CalendarService} from 'src/app/calendar/calendar.service';
import {TimeService} from 'src/app/common/time.service';
import {Router} from '@angular/router';
import {MessageBoxService} from 'src/app/message-box/message-box.service';
import {QuestionMode, QuestionResult} from 'src/app/message-box/message-box';

export interface CalendarData {
    start: Date;
    time: Date;
    duration: number;
}

@Component({
    selector: 't-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

    formGroup: FormGroup;

    get days(): CalendarData[] {
        const month = parseInt(this.formGroup.value['month']);
        //const filter = this.formGroup.value['filter'];
        const list = this.calendarService.getAllEntriesByMonth(month);
        list.sort((e1, e2) => e1.startWork - e2.startWork);
        return list.map(e => {
            return {
                start: this.timeService.timeToDate(e.startWork),
                time: this.timeService.durationToDate(e.accountableWorkingTime),
                duration: (e.accountableWorkingTime) / (1000 * 60 * 60)
            };
        });
    }

    get months(): Date[] {
        return this.calendarService.getAllMonthsAsDate();
    }

    get totalHours(): number{
        return this.calendarService.getTotalSumByMonth(this.formGroup.value['month']) / (1000 * 60 * 60);
    }
    
    constructor(
        private formBuilder: FormBuilder,
        private calendarService: CalendarService,
        private timeService: TimeService,
        private router: Router,
        private messageBoxService: MessageBoxService
    ) {}

    deleteDay(day: Date): void {
        this.messageBoxService.question(`Do you want to delete entry for day ${day.getDate()}?`, QuestionMode.YES_NO, 'Delete day').subscribe(result => {
            if (result === QuestionResult.YES) {
                this.calendarService.deleteDay(day.getMonth(), day.getDate());
            }
        });
    }

    editDay(day: Date): void {
        this.router.navigate(['/calendar', day.getMonth(), day.getDate()]);
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({});
        this.formGroup.addControl('month', this.formBuilder.control(new Date().getMonth(), {}));
        this.formGroup.addControl('filter', this.formBuilder.control('all', {}));
    }

    removeAll(): void {
        this.messageBoxService.question(`Do you want to delete all entries for this month?`, QuestionMode.YES_NO, 'Delete all').subscribe(result => {
            if (result === QuestionResult.YES) {
                this.calendarService.deleteMonth(this.formGroup.value['month']);
            }
        });
    }
}
