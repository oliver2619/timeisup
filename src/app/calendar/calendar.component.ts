import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {CalendarService} from 'src/app/calendar/calendar.service';
import {TimeService} from 'src/app/common/time.service';
import {Router} from '@angular/router';

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
                time: this.timeService.durationToDate(e.endWork - e.startWork - e.endPause + e.startPause),
                duration: (e.endWork - e.startWork - e.endPause + e.startPause) / (1000 * 60 * 60)
            };
        });
    }

    get months(): Date[] {
        return this.calendarService.getAllMonthsAsDate();
    }

    constructor(
        private formBuilder: FormBuilder,
        private calendarService: CalendarService,
        private timeService: TimeService,
        private router: Router
    ) {}

    editDay(day: Date): void {
        this.router.navigate(['/calendar', day.getMonth(), day.getDate()]);
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({});
        this.formGroup.addControl('month', this.formBuilder.control(new Date().getMonth(), {}));
        this.formGroup.addControl('filter', this.formBuilder.control('all', {}));
    }
}
