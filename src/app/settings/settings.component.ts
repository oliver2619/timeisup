import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {SettingsService} from 'src/app/settings/settings.service';
import {Router} from '@angular/router';

@Component({
    selector: 't-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    formGroup: FormGroup;

    get canSave(): boolean {return this.formGroup.valid;}

    constructor(
        private formBuilder: FormBuilder,
        private settingsService: SettingsService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({}, {
            validators: [
                (control: AbstractControl) => {
                    if (control.value['mo_fr'] === false && control.value['sa'] === false && control.value['su'] === false)
                        return {'mo_fr': 'Not set'};
                    return null;
                }
            ]
        });
        this.formGroup.addControl('hours', this.formBuilder.control(0, {validators: [Validators.required, Validators.min(1)]}));
        this.formGroup.addControl('maxHours', this.formBuilder.control(0, {validators: [Validators.required, Validators.min(0)]}));
        this.formGroup.addControl('percent', this.formBuilder.control(0, {validators: [Validators.required, Validators.min(1), Validators.max(100)]}));
        this.formGroup.addControl('granularity', this.formBuilder.control(0, {validators: [Validators.required, Validators.min(1)]}));
        this.formGroup.addControl('minBreak', this.formBuilder.control(0, {validators: [Validators.required, Validators.min(0)]}));
        this.formGroup.addControl('mo_fr', this.formBuilder.control(false, {validators: []}));
        this.formGroup.addControl('sa', this.formBuilder.control(false, {validators: []}));
        this.formGroup.addControl('su', this.formBuilder.control(false, {validators: []}));
        this.reset();
    }

    reset(): void {
        const work = this.settingsService.work;
        this.formGroup.setValue({
            hours: work.hoursPerWeek,
            percent: work.workingRate * 100,
            granularity: work.granularity,
            maxHours: work.maxHoursPerDay,
            minBreak: work.minMinutesBreak,
            mo_fr: work.mo_fr,
            sa: work.sa,
            su: work.su
        });
    }

    save(): void {
        const work = this.formGroup.value;
        this.settingsService.work = {
            hoursPerWeek: work['hours'],
            workingRate: work['percent'] / 100,
            granularity: work['granularity'],
            maxHoursPerDay: work['maxHours'],
            minMinutesBreak: work['minBreak'],
            mo_fr: work['mo_fr'],
            sa: work['sa'],
            su: work['su']
        };
        this.router.navigateByUrl('/dashboard');
    }
}
