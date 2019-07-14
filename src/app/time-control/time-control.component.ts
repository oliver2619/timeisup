
import {Component, OnInit, OnDestroy} from '@angular/core';
import {TimeControlService} from 'src/app/time-control/time-control.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MessageBoxService} from 'src/app/message-box/message-box.service';
import {QuestionMode, QuestionResult} from 'src/app/message-box/message-box';
import {TasksService} from 'src/app/tasks/tasks.service';
import {TaskJson} from 'src/app/tasks/task';
import {CalendarService} from 'src/app/calendar/calendar.service';
import {TimeService} from 'src/app/common/time.service';
import {EventJson} from 'src/app/events/event';
import {EventsService} from 'src/app/events/events.service';
import {Validators} from '@angular/forms';
import {TimeControlEventType} from 'src/app/time-control/time-control';
import {CalendarEventJson} from 'src/app/calendar/calendar';

@Component({
    selector: 't-time-control',
    templateUrl: './time-control.component.html',
    styleUrls: ['./time-control.component.scss']
})
export class TimeControlComponent implements OnInit, OnDestroy {

    formGroup: FormGroup;

    private _timer: number;

    get canRecordEvent(): boolean {return this.formGroup.controls['event'].valid && this.timeControlService.startWork !== undefined && this.timeControlService.endWork === undefined;}

    get canReset(): boolean {return this.timeControlService.startWork !== undefined;}

    get canSave(): boolean {return this.timeControlService.valid;}

    get canSelectEvent(): boolean {return this.timeControlService.startWork !== undefined && this.timeControlService.endWork === undefined;}

    get canStartTask(): boolean {return this.timeControlService.startWork !== undefined && this.timeControlService.endWork === undefined;}

    get events(): EventJson[] {return this.eventsService.all;}

    get isFinished(): boolean {return this.timeControlService.endWork !== undefined;}

    get pausedDate(): Date {return this.timeService.durationToDate(this.timeControlService.pausedTime);}

    get tasks(): TaskJson[] {return this.tasksService.all;}

    get workedHours(): number {return this.timeControlService.workedTime / (1000 * 60 * 60);}

    get workedDate(): Date {return this.timeService.durationToDate(this.timeControlService.workedTime);}

    constructor(
        private timeControlService: TimeControlService,
        private formBuilder: FormBuilder,
        private messageBoxService: MessageBoxService,
        private tasksService: TasksService,
        private eventsService: EventsService,
        private calendarService: CalendarService,
        private timeService: TimeService
    ) {}

    ngOnDestroy(): void {
        if (this._timer !== undefined) {
            window.clearInterval(this._timer);
            this._timer = undefined;
        }
    }

    ngOnInit(): void {
        this._timer = window.setInterval(() => {}, 1000);
        this.formGroup = this.formBuilder.group({});
        this.formGroup.addControl('task', this.formBuilder.control(this.timeControlService.task, {}));
        this.formGroup.addControl('event', this.formBuilder.control(null, {validators: Validators.required}));
    }

    recordEvent(): void {
        this.timeControlService.logEvent(parseInt(this.formGroup.value['event']));
    }

    reset(): void {
        this.messageBoxService.question('Do you want to reset all time logs for today?', QuestionMode.YES_NO, 'Resetting').subscribe(r => {
            if (r === QuestionResult.YES) {
                this.timeControlService.reset();
                this.reload();
            }
        });
    }

    save(): void {
        this.calendarService.logWork(this.timeControlService.startWork, this.timeControlService.endWork, this.timeControlService.pausedTime);
        const events: CalendarEventJson[] = this.timeControlService.events.filter(e => e.type === TimeControlEventType.EVENT).map(e => {
            return {
                time: e.start,
                event: e.id
            };
        });
        this.calendarService.logTasksAndEvents(this.timeControlService.startWork, this.timeControlService.calculateTasks(), events);
        this.timeControlService.reset();
        this.reload();
    }

    startTask(): void {
        this.timeControlService.task = parseInt(this.formGroup.value['task']);
    }

    private reload(): void {
        const v = this.formGroup.value;
        v['task'] = this.timeControlService.task;
        this.formGroup.setValue(v);
    }
}
