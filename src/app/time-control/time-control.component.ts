
import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {TimeControlService} from 'src/app/time-control/time-control.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageBoxService} from 'src/app/message-box/message-box.service';
import {QuestionMode, QuestionResult} from 'src/app/message-box/message-box';
import {TasksService} from 'src/app/tasks/tasks.service';
import {TaskJson} from 'src/app/tasks/task';
import {DialogComponent, Dialog} from 'src/app/dialog/dialog.component';
import {EditTimeComponent} from 'src/app/edit-time/edit-time.component';
import {CalendarService} from 'src/app/calendar/calendar.service';
import {TimeService} from 'src/app/common/time.service';

@Component({
    selector: 't-time-control',
    templateUrl: './time-control.component.html',
    styleUrls: ['./time-control.component.scss']
})
export class TimeControlComponent implements OnInit, OnDestroy {

    @ViewChild(DialogComponent)
    dialog: Dialog;

    @ViewChild(EditTimeComponent)
    editTime: EditTimeComponent;

    formGroup: FormGroup;

    taskLogs: Array<any> = [];

    private _timer: number;

    get canPause(): boolean {
        return this.timeControlService.startWork !== undefined && this.timeControlService.endWork === undefined && this.timeControlService.startPause === undefined;
    }

    get canReset(): boolean {
        return this.timeControlService.startWork !== undefined || this.timeControlService.endWork !== undefined || this.timeControlService.paused > 0;
    }

    get canResume(): boolean {
        return this.timeControlService.startWork !== undefined && this.timeControlService.endWork === undefined && this.timeControlService.startPause !== undefined;
    }

    get canSave(): boolean {
        return this.timeControlService.startWork !== undefined && this.timeControlService.endWork !== undefined && this.timeControlService.worked > 0;
    }

    get canStart(): boolean {
        return this.timeControlService.startWork === undefined;
    }

    get canStop(): boolean {
        return this.timeControlService.endWork === undefined && this.timeControlService.startWork !== undefined;
    }

    get endDate(): Date {return this.timeService.timeToDate(this.timeControlService.endWork);}

    get endPauseDate(): Date {
        if (this.timeControlService.startPause !== undefined)
            return this.timeService.timeToDate(this.timeControlService.startPause + this.timeControlService.paused);
    }

    get paused(): number {
        return Math.round(100 * this.timeControlService.paused / (1000 * 60 * 60)) / 100;
    }

    get pausedDate(): Date {return this.timeService.durationToDate(this.timeControlService.paused);}

    get startDate(): Date {
        if (this.timeControlService.startWork === undefined)
            return null;
        const ret = new Date();
        ret.setTime(this.timeControlService.startWork);
        return ret;
    }

    get startPauseDate(): Date {return this.timeService.timeToDate(this.timeControlService.startPause);}

    get tasks(): TaskJson[] {
        return this.tasksService.all;
    }

    get worked(): number {
        return Math.round(100 * this.timeControlService.worked / (1000 * 60 * 60)) / 100;
    }

    get workedDate(): Date {return this.timeService.durationToDate(this.timeControlService.worked);}

    constructor(
        private timeControlService: TimeControlService,
        private formBuilder: FormBuilder,
        private messageBoxService: MessageBoxService,
        private tasksService: TasksService,
        private calendarService: CalendarService,
        private timeService: TimeService
    ) {}

    editEndTime(): void {
        this.dialog.title = 'End time';
        this.editTime.setTime(this.timeControlService.endWork);
        this.dialog.show().subscribe(result => {
            if (result === true) {
                this.timeControlService.endWork = this.editTime.getTime();
            }
        });
    }

    editPauseTime(): void {
        this.dialog.title = 'Pause time';
        this.editTime.setDuration(this.timeControlService.paused);
        this.dialog.show().subscribe(result => {
            if (result === true) {
                this.timeControlService.paused = this.editTime.getDuration();
            }
        });
    }

    editStartTime(): void {
        this.dialog.title = 'Start time';
        this.editTime.setTime(this.timeControlService.startWork);
        this.dialog.show().subscribe(result => {
            if (result === true) {
                this.timeControlService.startWork = this.editTime.getTime();
            }
        });
    }

    ngOnDestroy(): void {
        window.clearInterval(this._timer);
    }

    ngOnInit(): void {
        this._timer = window.setInterval(() => {this.refreshTaskLogs();}, 1000);
        this.formGroup = this.formBuilder.group({});

        const taskCtrl = this.formBuilder.control(this.timeControlService.task, {});
        this.formGroup.addControl('task', taskCtrl);
        taskCtrl.valueChanges.subscribe(c => this.onTaskChange(parseInt(c)));
    }

    pause(): void {
        this.timeControlService.pause();
    }

    reset(): void {
        this.messageBoxService.question('Do you want to reset all time logs for today?', QuestionMode.YES_NO, 'Resetting').subscribe(r => {
            if (r === QuestionResult.YES) {
                this.timeControlService.reset();
                this.reload();
            }
        });
    }

    resume(): void {
        this.timeControlService.resume();
    }

    save(): void {
        this.messageBoxService.question('Have you finished all work for today?', QuestionMode.YES_NO, 'Saving worklog').subscribe(r => {
            if (r === QuestionResult.YES) {
                this.calendarService.logWork(this.timeControlService.startWork, this.timeControlService.endWork, this.timeControlService.firstPause, this.timeControlService.paused);
                this.calendarService.logTasks(this.timeControlService.startWork, this.timeControlService.tasks);
                this.timeControlService.reset();
                this.reload();
            }
        });
    }

    start(): void {
        this.timeControlService.start();
    }

    stop(): void {
        this.timeControlService.stop();
    }

    private onTaskChange(id: number): void {
        this.timeControlService.task = id;
    }

    private refreshTaskLogs(): void {
        this.taskLogs = [];
        const tasks = this.timeControlService.tasks;
        for (let id in tasks) {
            const taskObj = this.tasksService.getById(parseInt(id));
            if (taskObj !== undefined) {
                const duration = tasks[id];
                this.taskLogs.push({
                    name: taskObj.name,
                    duration: duration / (1000 * 60 * 60),
                    time: this.timeService.durationToDate(duration)
                });
            }
        }
        this.taskLogs.sort((e1, e2) => e1.name.localeCompare(e2.name));
    }

    private reload(): void {
        const v = this.formGroup.value;
        v['task'] = this.timeControlService.task;
        this.formGroup.setValue(v);
    }
}
