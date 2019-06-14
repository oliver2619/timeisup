
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MenubarComponent} from './menubar/menubar.component';
import {TimeControlComponent} from './time-control/time-control.component';
import {DialogComponent} from './dialog/dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CalendarComponent} from './calendar/calendar.component';
import {TasksComponent} from './tasks/tasks.component';
import {CategoriesComponent} from './categories/categories.component';
import { SettingsComponent } from './settings/settings.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { EditTimeComponent } from './edit-time/edit-time.component';
import { EditDayComponent } from './edit-day/edit-day.component';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { TagComponent } from './tag/tag.component';

@NgModule({
    declarations: [
        AppComponent,
        WelcomeComponent,
        DashboardComponent,
        MenubarComponent,
        TimeControlComponent,
        DialogComponent,
        CalendarComponent,
        TasksComponent,
        CategoriesComponent,
        SettingsComponent,
        MessageBoxComponent,
        ErrorMessageComponent,
        EditCategoryComponent,
        EditTaskComponent,
        EditTimeComponent,
        EditDayComponent,
        TitlebarComponent,
        TagComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        NgbModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
