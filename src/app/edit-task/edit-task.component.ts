//
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {TaskJson} from 'src/app/tasks/task';
import {TasksService} from 'src/app/tasks/tasks.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ErrorMessageService} from 'src/app/error-message/error-message.service';
import {CategoryJson} from 'src/app/categories/category';
import {CategoriesService} from 'src/app/categories/categories.service';

@Component({
    selector: 't-edit-task',
    templateUrl: './edit-task.component.html',
    styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

    formGroup: FormGroup;

    private task: TaskJson;
    private _categories: CategoryJson[];

    get allCategories(): CategoryJson[] {
        return this.categoriesService.all.filter(c => !this.hasCategory(c.id));
    }

    get canAddCategory(): boolean {return this.formGroup.value['category'] !== null;}

    get canSave(): boolean {return this.formGroup.valid;}

    get canSelectCategory(): boolean {return this.allCategories.length > 0;}
    
    get categories(): CategoryJson[] {return this._categories;}

    constructor(
        private formBuilder: FormBuilder,
        private errorMessageService: ErrorMessageService,
        private tasksService: TasksService,
        private categoriesService: CategoriesService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    addCategory(): void {
        const catId = parseInt(this.formGroup.value['category']);
        this._categories.push(this.categoriesService.getById(catId));
        this.sortCategories();
        const value = this.formGroup.value;
        value['category'] = null;
        this.formGroup.setValue(value);
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({});
        this.formGroup.addControl('name', this.formBuilder.control('', {validators: [Validators.required, Validators.minLength(1)]}));
        this.formGroup.addControl('category', this.formBuilder.control(null, {}));
        const id = parseInt(this.activatedRoute.snapshot.params['id']);
        this.task = this.tasksService.getById(id);
        if (this.task !== undefined) {
            const v = this.formGroup.value;
            v['name'] = this.task.name;
            this.formGroup.setValue(v);
            this._categories = this.task.categories.map(c => this.categoriesService.getById(c));
            this.sortCategories();
        }
    }

    onSave(): void {
        const name = this.formGroup.value['name'];
        try {
            this.tasksService.edit(this.task.id, name, this._categories.map(c => c.id));
            this.router.navigateByUrl('/tasks');
        } catch (e) {
            this.errorMessageService.error(`Failed to rename task '${this.task.name}' to '${name}'`, e);
        }
    }

    removeCategory(id: number): void {
        this._categories = this._categories.filter(c => c.id !== id);
    }

    private hasCategory(id: number): boolean {
        return this._categories.find(c => c.id === id) !== undefined;
    }
    
    private sortCategories(): void {
        this._categories.sort((e1, e2) => e1.name.localeCompare(e2.name));
    }
}
