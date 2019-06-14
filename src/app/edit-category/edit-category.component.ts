
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriesService} from 'src/app/categories/categories.service';
import {ErrorMessageService} from 'src/app/error-message/error-message.service';
import {CategoryJson} from 'src/app/categories/category';

@Component({
    selector: 't-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit{

    formGroup: FormGroup;

    private category: CategoryJson;

    get canSave(): boolean {return this.formGroup.valid;}

    constructor(
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private errorMessageService: ErrorMessageService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({});
        this.formGroup.addControl('name', this.formBuilder.control('', {validators: [Validators.required, Validators.minLength(1)]}));
        const id = parseInt(this.activatedRoute.snapshot.params['id']);
        this.category = this.categoriesService.getById(id);
        if (this.category !== undefined) {
            const v = this.formGroup.value;
            v['name'] = this.category.name;
            this.formGroup.setValue(v);
        }
    }

    onSave(): void {
        const newName = this.formGroup.value['name'];
        try {
            this.categoriesService.rename(this.category.id, newName);
            this.router.navigateByUrl('/categories');
        } catch (e) {
            this.errorMessageService.error(`Failed to rename category '${this.category.name}' to '${newName}'`, e);
        }
    }
}
