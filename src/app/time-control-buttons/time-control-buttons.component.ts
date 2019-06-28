import {Component} from '@angular/core';
import {TimeControlService} from 'src/app/time-control/time-control.service';

@Component({
    selector: 't-time-control-buttons',
    templateUrl: './time-control-buttons.component.html',
    styleUrls: ['./time-control-buttons.component.scss']
})
export class TimeControlButtonsComponent {

    get canPause(): boolean {
        return this.timeControlService.startWork !== undefined && this.timeControlService.endWork === undefined && !this.timeControlService.isPaused;
    }

    get canResume(): boolean {
        return this.timeControlService.startWork !== undefined && this.timeControlService.endWork === undefined && this.timeControlService.isPaused;
    }

    get canStart(): boolean {
        return this.timeControlService.startWork === undefined;
    }

    get canStop(): boolean {
        return this.timeControlService.endWork === undefined && this.timeControlService.startWork !== undefined;
    }

    constructor(
        private timeControlService: TimeControlService
    ) {}

    pause(): void {
        this.timeControlService.pause();
    }

    resume(): void {
        this.timeControlService.resume();
    }

    start(): void {
        this.timeControlService.start();
    }

    stop(): void {
        this.timeControlService.stop();
    }
}
