import {Component, ViewChild} from '@angular/core';
import {TimeControlService} from 'src/app/time-control/time-control.service';
import {TimeControlEventJson, TimeControlEventType} from 'src/app/time-control/time-control';
import {TimeService} from 'src/app/common/time.service';
import {DialogComponent, Dialog} from 'src/app/dialog/dialog.component';
import {EditTimeComponent} from 'src/app/edit-time/edit-time.component';
import {MessageBoxService} from 'src/app/message-box/message-box.service';
import {QuestionMode, QuestionResult} from 'src/app/message-box/message-box';
import {EditStartEndTimeComponent} from 'src/app/edit-start-end-time/edit-start-end-time.component';
import {TasksService} from 'src/app/tasks/tasks.service';
import {EventsService} from 'src/app/events/events.service';

export interface TimeControlLogItem {
    event: TimeControlEventJson;
    name: string;
}

@Component({
    selector: 't-time-control-log',
    templateUrl: './time-control-log.component.html',
    styleUrls: ['./time-control-log.component.scss']
})
export class TimeControlLogComponent {

    @ViewChild('dlgTime')
    dlgTime: Dialog;

    @ViewChild('dlgTimespan')
    dlgTimespan: Dialog;

    @ViewChild('time')
    editTime: EditTimeComponent;

    @ViewChild('timespan')
    editTimespan: EditStartEndTimeComponent;

    get endDate(): Date {return this.timeService.timeToDate(this.timeControlService.endWork);}

    get events(): TimeControlLogItem[] {
        const self = this;
        return this.timeControlService.events.map(e => {
            return {
                event: e,
                name: self.getEventTypeDescription(e)
            };
        });
    }

    get hasEndDate(): boolean {return this.timeControlService.endWork !== undefined;}

    get hasStartDate(): boolean {return this.timeControlService.startWork !== undefined;}

    get isEndDateInvalid(): boolean {return !this.timeControlService.isEndWorkValid;}

    get startDate(): Date {
        if (this.timeControlService.startWork === undefined)
            return null;
        const ret = new Date();
        ret.setTime(this.timeControlService.startWork);
        return ret;
    }

    constructor(
        private timeControlService: TimeControlService,
        private timeService: TimeService,
        private messageBoxService: MessageBoxService,
        private tasksService: TasksService,
        private eventsService: EventsService
    ) {}

    editEndTime(): void {
        this.dlgTime.title = 'End time';
        this.editTime.setTime(this.timeControlService.endWork);
        this.dlgTime.show().subscribe(result => {
            if (result === true) {
                this.timeControlService.endWork = this.editTime.getTime();
            }
        });
    }

    editEvent(i: number): void {
        const ev = this.events[i];
        this.dlgTimespan.title = ev.name;
        this.editTimespan.setTimes(ev.event.start, ev.event.end);
        this.dlgTimespan.show().subscribe(result => {
            if (result === true) {
                this.timeControlService.moveEventByIndex(i, this.editTimespan.start, this.editTimespan.end);
            }
        });
    }

    editStartTime(): void {
        this.dlgTime.title = 'Start time';
        this.editTime.setTime(this.timeControlService.startWork);
        this.dlgTime.show().subscribe(result => {
            if (result === true) {
                this.timeControlService.startWork = this.editTime.getTime();
            }
        });
    }

    isEventInvalid(i: number): boolean {
        return !this.timeControlService.isEventValid(i);
    }
    
    removeEvent(i: number): void {
        this.messageBoxService.question(`Do you want to delete '${this.events[i].name}'?`, QuestionMode.YES_NO, 'Delete log entry').subscribe(result => {
            if (result === QuestionResult.YES) {
                this.timeControlService.removeEventByIndex(i);
            }
        });
    }

    private getEventTypeDescription(ev: TimeControlEventJson): string {
        switch (ev.type) {
            case TimeControlEventType.PAUSE:
                return 'Pause';
            case TimeControlEventType.TASK:
                return this.tasksService.getTaskNameById(ev.id);
            case TimeControlEventType.EVENT:
                return this.eventsService.getEventNameById(ev.id);
            default:
                return '';
        }
    }
}
