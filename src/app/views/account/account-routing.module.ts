import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./admin.component";

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
      tittle: "Account",
    },
    children: [
      {
        path: "",
        redirectTo: "admin",
      },
      {
        path: "admin",
        component: AdminComponent,
        data: {
          title: "Admin",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
