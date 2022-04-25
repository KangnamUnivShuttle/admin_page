import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ShuttleNoticeComponent } from "./shuttle-notice.component";
import { ShuttleRouteComponent } from "./shuttle-route.component";
import { ShuttleScheduleComponent } from "./shuttle-schedule.component";

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
      tittle: "KNU",
    },
    children: [
      {
        path: "",
        redirectTo: "shuttle/schedule",
      },
      {
        path: "shuttle/schedule",
        component: ShuttleScheduleComponent,
        data: {
          title: "Shuttle Schedule",
        },
      },
      {
        path: "shuttle/route",
        component: ShuttleRouteComponent,
        data: {
          title: "Shuttle Route",
        },
      },
      {
        path: "shuttle/notice",
        component: ShuttleNoticeComponent,
        data: {
          title: "Shuttle Notice",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KNURoutingModule {}
