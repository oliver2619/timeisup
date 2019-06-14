import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WelcomeComponent} from 'src/app/welcome/welcome.component';
import {DashboardComponent} from 'src/app/dashboard/dashboard.component';
import {TimeControlComponent} from 'src/app/time-control/time-control.component';
import {CalendarComponent} from 'src/app/calendar/calendar.component';
import {TasksComponent} from 'src/app/tasks/tasks.component';
import {CategoriesComponent} from 'src/app/categories/categories.component';
import {SettingsComponent} from 'src/app/settings/settings.component';
import {EditCategoryComponent} from 'src/app/edit-category/edit-category.component';
import {EditDayComponent} from 'src/app/edit-day/edit-day.component';
import {EditTaskComponent} from 'src/app/edit-task/edit-task.component';

const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    component: WelcomeComponent
}, {
    path: 'calendar',
    pathMatch: 'full',
    component: CalendarComponent
}, {
    path: 'calendar/:month/:day',
    pathMatch: 'full',
    component: EditDayComponent
}, {
    path: 'categories',
    pathMatch: 'full',
    component: CategoriesComponent
}, {
    path: 'categories/:id',
    pathMatch: 'full',
    component: EditCategoryComponent
}, {
    path: 'dashboard',
    pathMatch: 'full',
    component: DashboardComponent
}, {
    path: 'settings',
    pathMatch: 'full',
    component: SettingsComponent
}, {
    path: 'tasks',
    pathMatch: 'full',
    component: TasksComponent
}, {
    path: 'tasks/:id',
    pathMatch: 'full',
    component: EditTaskComponent
}, {
    path: 'timecontrol',
    pathMatch: 'full',
    component: TimeControlComponent
}];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
