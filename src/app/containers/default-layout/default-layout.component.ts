import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "../../services/http.services";
import { InfiniteScrollService } from "../../services/infiniteScroll.services";
import { navItems } from "../../_nav";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private infiniteScrollService: InfiniteScrollService
  ) {}

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  onBtnLogoutClicked() {
    this.httpService
      .reqDelete("auth", null)
      .toPromise()
      .then((res) => {
        this.router.navigate(["/login"]);
      });
  }

  onScroll(event) {
    this.infiniteScrollService.onScroll(event);
  }
}
