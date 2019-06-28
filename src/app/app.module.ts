
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
import { EventsComponent } from './events/events.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { TimeControlButtonsComponent } from './time-control-buttons/time-control-buttons.component';
import { TimeControlLogComponent } from './time-control-log/time-control-log.component';
import { EditStartEndTimeComponent } from './edit-start-end-time/edit-start-end-time.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';

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
        TagComponent,
        EventsComponent,
        EditEventComponent,
        TimeControlButtonsComponent,
        TimeControlLogComponent,
        EditStartEndTimeComponent,
        AboutComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        NgbModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
