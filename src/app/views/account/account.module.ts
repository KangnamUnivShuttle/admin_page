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
import { AdminComponent } from "./admin.component";
import { AccountRoutingModule } from "./account-routing.module";

@NgModule({
  imports: [
    AccountRoutingModule,
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
  declarations: [AdminComponent], //[ WidgetsComponent ]
})
export class AccountModule {}
