import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SchedulerComponent } from "./scheduler.component";
import { StatisticsComponent } from "./statistics.component";

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
    path: "",
    data: {
      tittle: "System",
    },
    children: [
      {
        path: "",
        redirectTo: "statistics",
      },
      {
        path: "statistics",
        component: StatisticsComponent,
        data: {
          title: "Statistics",
        },
      },
      {
        path: "scheduler",
        component: SchedulerComponent,
        data: {
          title: "Scheduler",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
