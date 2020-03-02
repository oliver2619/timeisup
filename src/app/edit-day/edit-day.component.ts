
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CalendarService} from 'src/app/calendar/calendar.service';
import {CalendarDayJson} from 'src/app/calendar/calendar';
import {TimeService} from 'src/app/common/time.service';
import {TasksService} from 'src/app/tasks/tasks.service';
import {CategoriesService} from 'src/app/categories/categories.service';
import {EventsService} from 'src/app/events/events.service';
import {Subscription} from 'rxjs';

export interface EditDayTaskData {
    name: string;
    durationHours: number;
    durationDate: Date;
}

export interface EditDayEventData {
    time: Date;
    event: string;
}

@Component({
    selector: 't-edit-day',
    templateUrl: './edit-day.component.html',
    styleUrls: ['./edit-day.component.scss']
})
export class EditDayComponent implements OnInit, OnDestroy {

    month: number;
    previousDay: number;
    nextDay: number;

    private subscription: Subscription;
    private _data: CalendarDayJson;

    get accountableDate(): Date {
        return this.timeService.durationToDate(this._data.accountableWorkingTime);
    }

    get accountableHours(): number {
        return this._data.accountableWorkingTime / (1000 * 60 * 60);
    }

    get categories(): EditDayTaskData[] {
        const cats: {[key: number]: number} = {};
        for (let t in this._data.tasks) {
            const id = parseInt(t);
            const task = this.tasksService.getById(id);
            if (task !== undefined) {
                const duration = this._data.tasks[id];
                task.categories.forEach(c => {
                    if (cats[c] === undefined)
                        cats[c] = duration;
                    else
                        cats[c] += duration;
                });
            }
        }
        const ret: EditDayTaskData[] = [];
        for (let c in cats) {
            const cId = parseInt(c);
            ret.push({
                name: this.categoriesService.getById(cId).name,
                durationHours: cats[cId] / (1000 * 60 * 60),
                durationDate: this.timeService.durationToDate(cats[cId])
            });
        }
        ret.sort((e1, e2) => e1.name.localeCompare(e2.name));
        return ret;
    }

    get durationDate(): Date {
        return this.timeService.durationToDate(this._data.endWork - this._data.startWork - this._data.paused);
    }

    get durationHours(): number {
        return (this._data.endWork - this._data.startWork - this._data.paused) / (1000 * 60 * 60);
    }

    get end(): Date {return this.timeService.timeToDate(this._data.endWork);}

    get events(): EditDayEventData[] {
        return this._data.events.map(e => {
            return {
                time: this.timeService.timeToDate(e.time),
                event: this.eventsService.getEventNameById(e.event)
            };
        });
    }

    get hasPrevDay(): boolean {
        return this.previousDay !== undefined;
    }

    get hasNextDay(): boolean {
        return this.nextDay !== undefined;
    }

    get pausedDate(): Date {
        return this.timeService.durationToDate(this._data.paused);
    }

    get pausedHours(): number {
        return (this._data.paused) / (1000 * 60 * 60);
    }

    get start(): Date {return this.timeService.timeToDate(this._data.startWork);}

    get tasks(): EditDayTaskData[] {
        const ret: EditDayTaskData[] = [];
        for (let t in this._data.tasks) {
            const id = parseInt(t);
            const task = this.tasksService.getById(id);
            if (task !== undefined) {
                const duration = this._data.tasks[id];
                ret.push({
                    name: task.name,
                    durationHours: duration / (1000 * 60 * 60),
                    durationDate: this.timeService.durationToDate(duration)
                });
            }
        }
        ret.sort((e1, e2) => e1.name.localeCompare(e2.name));
        return ret;
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private calendarService: CalendarService,
        private timeService: TimeService,
        private tasksService: TasksService,
        private categoriesService: CategoriesService,
        private eventsService: EventsService
    ) {}

    ngOnInit(): void {
        this.subscription = this.activatedRoute.params.subscribe({
            next: params => {
                this.month = parseInt(params['month']);
                const day = parseInt(params['day']);
                this._data = this.calendarService.getByDay(this.month, day);
                this.previousDay = this.calendarService.getPreviousDay(this.month, day);
                this.nextDay = this.calendarService.getNextDay(this.month, day);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
