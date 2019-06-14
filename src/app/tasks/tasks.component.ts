
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ErrorMessageService} from 'src/app/error-message/error-message.service';
import {TasksService} from 'src/app/tasks/tasks.service';
import {TaskJson} from 'src/app/tasks/task';
import {QuestionResult, QuestionMode} from 'src/app/message-box/message-box';
import {MessageBoxService} from 'src/app/message-box/message-box.service';
import {DialogComponent, Dialog} from 'src/app/dialog/dialog.component';
import {EditTaskComponent} from 'src/app/edit-task/edit-task.component';
import {Router} from '@angular/router';
import {CalendarService} from 'src/app/calendar/calendar.service';

@Component({
    selector: 't-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

    formGroup: FormGroup;

    get canAdd(): boolean {
        return this.formGroup.valid;
    }

    get tasks(): TaskJson[] {
        return this.tasksService.all.sort((c1, c2) => c1.name.localeCompare(c2.name));
    }

    constructor(
        private formBuilder: FormBuilder,
        private tasksService: TasksService,
        private errorMessageService: ErrorMessageService,
        private messageBoxService: MessageBoxService,
        private calendarService: CalendarService,
        private router: Router
    ) {}

    add(): void {
        const name = this.formGroup.value['name'];
        try {
            this.tasksService.add(name);
            this.formGroup.setValue({
                name: ''
            });
        } catch (e) {
            this.errorMessageService.error(`Failed to add task '${name}'`, e);
        }
    }

    canDelete(id: number): boolean {
        return !this.calendarService.isTaskUsed(id);

    }

    deleteById(id: number): void {
        const task = this.tasksService.getById(id);
        if (task !== undefined) {
            this.messageBoxService.question(`Do you want to delete task '${task.name}'?`, QuestionMode.YES_NO, 'Deleting category').subscribe(result => {
                if (result === QuestionResult.YES)
                    this.tasksService.deleteById(id);
            });
        }
    }

    editById(id: number): void {
        this.router.navigate(['/tasks', id]);
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({});
        this.formGroup.addControl('name', this.formBuilder.control('', {validators: [Validators.minLength(1), Validators.required]}));
    }

}
