import { NgModule } from "@angular/core";
import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";

// import { WidgetsComponent } from './widgets.component';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AlertModule } from "ngx-bootstrap/alert";
import { ModalModule } from "ngx-bootstrap/modal";
import { MatSelectModule } from "@angular/material/select";
import { StatisticsComponent } from "./statistics.component";
import { SystemRoutingModule } from "./system-routing.module";
import { SchedulerComponent } from "./scheduler.component";

// import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";

@NgModule({
  imports: [
    SystemRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    FormsModule,
    // BrowserModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSnackBarModule,
    MatRadioModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    // BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [StatisticsComponent, SchedulerComponent], //[ WidgetsComponent ]
})
export class SystemModule {}
