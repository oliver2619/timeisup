
import {Component, OnInit} from '@angular/core';
import {DialogContent} from 'src/app/dialog/dialog.component';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 't-edit-time',
    templateUrl: './edit-time.component.html',
    styleUrls: ['./edit-time.component.scss']
})
export class EditTimeComponent implements OnInit, DialogContent {

    formGroup: FormGroup;

    private _date: Date;

    get valid(): boolean {
        return this.formGroup.valid;
    }

    constructor(private formBuilder: FormBuilder) {}

    getDuration(): number {
        const v = this.formGroup.value['time'];
        const d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        const t1 = d.getTime();
        d.setHours(v['hour']);
        d.setMinutes(v['minute']);
        return d.getTime() - t1;
    }

    getTime(): number {
        const d = new Date();
        d.setTime(this._date.getTime());
        const v = this.formGroup.value['time'];
        d.setHours(v['hour']);
        d.setMinutes(v['minute']);
        return d.getTime();
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({});
        this.formGroup.addControl('time', this.formBuilder.control({}, {
            validators: control => {
                if (control.value === null) {
                    return {'time': 'not set'};
                }
                const h = control.value['hour'];
                if (h === undefined || isNaN(h))
                    return {'time.hour': 'not set'};
                const m = control.value['minute'];
                if (m === undefined || isNaN(m))
                    return {'time.minute': 'not set'};
                return null;
            }
        }));
    }

    setDuration(time: number): void {
        const d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        d.setTime(d.getTime() + time);

        const v = this.formGroup.value;
        v['time'] = {hour: d.getHours(), minute: d.getMinutes()};
        this.formGroup.setValue(v);
    }

    setTime(time: number): void {
        this._date = new Date();
        if (time !== undefined)
            this._date.setTime(time);
        const v = this.formGroup.value;
        v['time'] = {hour: this._date.getHours(), minute: this._date.getMinutes()};
        this.formGroup.setValue(v);
    }


}
