import {Component, ViewChild} from '@angular/core';
import {CalendarService} from 'src/app/calendar/calendar.service';
import {TimeService} from 'src/app/common/time.service';
import {Dialog} from 'src/app/dialog/dialog.component';
import {EditTimeComponent} from 'src/app/edit-time/edit-time.component';
import {MessageBoxService} from 'src/app/message-box/message-box.service';
import {QuestionMode, QuestionResult} from 'src/app/message-box/message-box';

@Component({
    selector: 't-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    @ViewChild('dlgTime')
    dlgTime: Dialog;

    @ViewChild('time')
    editTime: EditTimeComponent;

    get bonusTime(): Date {
        return this.timeService.durationToDate(this.calendarService.bonusTime);
    }

    constructor(
        private calendarService: CalendarService,
        private messageBoxService: MessageBoxService,
        private timeService: TimeService
    ) {}

    clearBonusTime(): void {
        this.messageBoxService.question('Do you want to clear the bonus time?', QuestionMode.YES_NO, 'Clear bonus time').subscribe(result => {
            if (result === QuestionResult.YES) {
                this.calendarService.bonusTime = 0;
            }
        });
    }

    editBonusTime(): void {
        this.dlgTime.title = 'Bonus time';
        this.editTime.setDuration(this.calendarService.bonusTime);
        this.dlgTime.show().subscribe(result => {
            if (result === true) {
                this.calendarService.bonusTime = this.editTime.getDuration();
            }
        });
    }
}
