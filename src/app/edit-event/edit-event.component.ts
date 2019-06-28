import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {EventJson} from 'src/app/events/event';
import {EventsService} from 'src/app/events/events.service';
import {ErrorMessageService} from 'src/app/error-message/error-message.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 't-edit-event',
    templateUrl: './edit-event.component.html',
    styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

    formGroup: FormGroup;

    private event: EventJson;

    get canSave(): boolean {return this.formGroup.valid;}

    constructor(
        private formBuilder: FormBuilder,
        private eventsService: EventsService,
        private errorMessageService: ErrorMessageService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({});
        this.formGroup.addControl('name', this.formBuilder.control('', {validators: [Validators.required, Validators.minLength(1)]}));
        const id = parseInt(this.activatedRoute.snapshot.params['id']);
        this.event = this.eventsService.getById(id);
        if (this.event !== undefined) {
            const v = this.formGroup.value;
            v['name'] = this.event.name;
            this.formGroup.setValue(v);
        }
    }

    onSave(): void {
        const newName = this.formGroup.value['name'];
        try {
            this.eventsService.rename(this.event.id, newName);
            this.router.navigateByUrl('/events');
        } catch (e) {
            this.errorMessageService.error(`Failed to rename event '${this.event.name}' to '${newName}'`, e);
        }
    }
}
