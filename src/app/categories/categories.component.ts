
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CategoriesService} from 'src/app/categories/categories.service';
import {CategoryJson} from 'src/app/categories/category';
import {ErrorMessageService} from 'src/app/error-message/error-message.service';
import {QuestionResult, QuestionMode} from 'src/app/message-box/message-box';
import {MessageBoxService} from 'src/app/message-box/message-box.service';
import {Router} from '@angular/router';
import {TasksService} from 'src/app/tasks/tasks.service';

@Component({
    selector: 't-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

    formGroup: FormGroup;

    get canAdd(): boolean {
        return this.formGroup.valid;
    }

    get categories(): CategoryJson[] {
        return this.categoriesService.all.sort((c1, c2) => c1.name.localeCompare(c2.name));
    }

    constructor(
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private errorMessageService: ErrorMessageService,
        private messageBoxService: MessageBoxService,
        private tasksService: TasksService,
        private router: Router
    ) {}

    add(): void {
        const name = this.formGroup.value['name'];
        try {
            this.categoriesService.add(name);
            this.formGroup.setValue({
                name: ''
            });
        } catch (e) {
            this.errorMessageService.error(`Failed to add category '${name}'`, e);
        }
    }

    editById(id: number): void {
        this.router.navigate(['categories', id]);
    }

    deleteById(id: number): void {
        const cat = this.categoriesService.getById(id);
        if (cat !== undefined) {
            this.messageBoxService.question(`Do you want to delete category '${cat.name}'?`, QuestionMode.YES_NO, 'Deleting category').subscribe(result => {
                if (result === QuestionResult.YES) {
                    this.categoriesService.deleteById(id);
                    this.tasksService.deleteCategory(id);
                }
            });
        }
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({});
        this.formGroup.addControl('name', this.formBuilder.control('', {validators: [Validators.minLength(1), Validators.required]}));
    }
}
