import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {EventJson} from 'src/app/events/event';
import {EventsService} from 'src/app/events/events.service';
import {ErrorMessageService} from 'src/app/error-message/error-message.service';
import {MessageBoxService} from 'src/app/message-box/message-box.service';
import {Router} from '@angular/router';
import {QuestionMode, QuestionResult} from 'src/app/message-box/message-box';

@Component({
    selector: 't-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

    formGroup: FormGroup;

    get canAdd(): boolean {
        return this.formGroup.valid;
    }

    get events(): EventJson[] {
        return this.eventsService.all.sort((c1, c2) => c1.name.localeCompare(c2.name));
    }


    constructor(
        private formBuilder: FormBuilder,
        private eventsService: EventsService,
        private errorMessageService: ErrorMessageService,
        private messageBoxService: MessageBoxService,
        private router: Router
    ) {}

    add(): void {
        const name = this.formGroup.value['name'];
        try {
            this.eventsService.add(name);
            this.formGroup.setValue({
                name: ''
            });
        } catch (e) {
            this.errorMessageService.error(`Failed to add event '${name}'`, e);
        }
    }

    editById(id: number): void {
        this.router.navigate(['events', id]);
    }

    deleteById(id: number): void {
        const ev = this.eventsService.getById(id);
        if (ev !== undefined) {
            this.messageBoxService.question(`Do you want to delete event '${ev.name}'?`, QuestionMode.YES_NO, 'Deleting event').subscribe(result => {
                if (result === QuestionResult.YES) {
                    this.eventsService.deleteById(id);
                }
            });
        }
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({});
        this.formGroup.addControl('name', this.formBuilder.control('', {validators: [Validators.minLength(1), Validators.required]}));
    }
}
