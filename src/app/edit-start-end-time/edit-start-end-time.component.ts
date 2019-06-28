import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {DialogContent} from 'src/app/dialog/dialog.component';

@Component({
    selector: 't-edit-start-end-time',
    templateUrl: './edit-start-end-time.component.html',
    styleUrls: ['./edit-start-end-time.component.scss']
})
export class EditStartEndTimeComponent implements OnInit, DialogContent {

    formGroup: FormGroup;

    private _start: Date;
    private _end: Date;

    get end(): number {
        if (this._end === undefined)
            return undefined;
        const d = new Date();
        d.setTime(this._end.getTime());
        const v = this.formGroup.value['end'];
        d.setHours(v['hour']);
        d.setMinutes(v['minute']);
        d.setSeconds(0, 0);
        return d.getTime();
    }

    get hasEnd(): boolean {return this._end !== undefined;}

    get start(): number {
        const d = new Date();
        d.setTime(this._start.getTime());
        const v = this.formGroup.value['start'];
        d.setHours(v['hour']);
        d.setMinutes(v['minute']);
        d.setSeconds(0, 0);
        return d.getTime();
    }

    get valid(): boolean {
        return this.formGroup.valid;
    }

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({}, {
            validators: control => {
                if(this.hasEnd && this.end <= this.start) {
                    return {'end': 'must be after start'};
                }
                return null;
            }
        });
        this.formGroup.addControl('start', this.formBuilder.control({}, {
            validators: control => {
                if (control.value === null) {
                    return {'start': 'not set'};
                }
                const h = control.value['hour'];
                if (h === undefined || isNaN(h))
                    return {'start.hour': 'not set'};
                const m = control.value['minute'];
                if (m === undefined || isNaN(m))
                    return {'start.minute': 'not set'};
                return null;
            }
        }));
        const self = this;
        this.formGroup.addControl('end', this.formBuilder.control({}, {
            validators: control => {
                if (!self.hasEnd)
                    return null;
                if (control.value === null) {
                    return {'start': 'not set'};
                }
                const h = control.value['hour'];
                if (h === undefined || isNaN(h))
                    return {'end.hour': 'not set'};
                const m = control.value['minute'];
                if (m === undefined || isNaN(m))
                    return {'end.minute': 'not set'};
                return null;
            }
        }));
    }

    setTimes(start: number, end: number): void {
        const v = this.formGroup.value;
        this._start = new Date();
        this._start.setTime(start);
        v['start'] = {hour: this._start.getHours(), minute: this._start.getMinutes()};
        if (end !== undefined) {
            this._end = new Date();
            this._end.setTime(end);
            v['end'] = {hour: this._end.getHours(), minute: this._end.getMinutes()};
        } else
            this._end = undefined;
        this.formGroup.setValue(v);
    }
}
