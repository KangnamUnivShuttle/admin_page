import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockComponent } from './block.component';
import { PluginComponent } from './plugin.component';
import { RuntimeFlowComponent } from './runtime-flow.component';

// import { WidgetsComponent } from './widgets.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: WidgetsComponent,
  //   data: {
  //     title: 'Widgets'
  //   }
  // }
  {
    path: 'block',
    component: BlockComponent,
    data: {
      tittle: 'Block'
    }
  },
  {
    path: 'runtime-flow',
    component: RuntimeFlowComponent,
    data: {
      title: 'Runtime Flow'
    }
  },
  {
    path: 'plugin',
    component: PluginComponent,
    data: {
      title: 'Plugin'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuntimeRoutingModule {}
