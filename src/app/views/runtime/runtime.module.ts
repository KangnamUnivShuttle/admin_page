import { NgModule } from "@angular/core";
import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";

// import { WidgetsComponent } from './widgets.component';
import { BlockComponent } from "./block.component";
import { RuntimeFlowComponent } from "./runtime-flow.component";
import { PluginComponent } from "./plugin.component";
import { RuntimeRoutingModule } from "./runtime-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AlertModule } from "ngx-bootstrap/alert";
import { ModalModule } from "ngx-bootstrap/modal";
import { MatSelectModule } from "@angular/material/select";
import { RuntimeFlow2Component } from "./runtime-flow2.component";
import { RuntimeCardComponent } from "./components/runtime-card.component";
import { RuntimeStartComponent } from "./components/runtime-start.component";
import { RuntimeLinkComponent } from "./components/runtime-link.component";
import { RuntimeSearchComponent } from "./components/runtime-search.component";
import { RuntimeImageComponent } from "./components/runtime-image.component";
import { RuntimeOgtagComponent } from "./components/runtime-ogtag.component";
import { TableViewComponent } from "../../components/tableView.component";
import { PagingComponent } from "../../components/paging.component";

@NgModule({
  imports: [
    RuntimeRoutingModule,
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
    BlockComponent,
    RuntimeFlowComponent,
    PluginComponent,
    RuntimeFlow2Component,
    RuntimeCardComponent,
    RuntimeStartComponent,
    RuntimeLinkComponent,

    RuntimeSearchComponent,
    RuntimeImageComponent,
    RuntimeOgtagComponent,

    TableViewComponent,
    PagingComponent,
  ], //[ WidgetsComponent ]
})
export class RuntimeModule {}
