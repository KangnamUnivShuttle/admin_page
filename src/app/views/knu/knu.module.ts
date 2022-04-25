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
import { KNURoutingModule } from "./knu-routing.module";
import { ShuttleNoticeComponent } from "./shuttle-notice.component";
import { ShuttleRouteComponent } from "./shuttle-route.component";
import { ShuttleScheduleComponent } from "./shuttle-schedule.component";

@NgModule({
  imports: [
    KNURoutingModule,
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
  ],
  declarations: [
    ShuttleNoticeComponent,
    ShuttleRouteComponent,
    ShuttleScheduleComponent,
  ], //[ WidgetsComponent ]
})
export class KNUModule {}
