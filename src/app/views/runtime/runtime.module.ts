import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// import { WidgetsComponent } from './widgets.component';
import { BlockComponent } from './block.component';
import { RuntimeFlowComponent } from './runtime-flow.component';
import { PluginComponent } from './plugin.component';
import { RuntimeRoutingModule } from './runtime-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    RuntimeRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule
  ],
  declarations: [BlockComponent, RuntimeFlowComponent, PluginComponent] //[ WidgetsComponent ]
})
export class RuntimeModule { }
