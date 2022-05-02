import { AfterViewInit, Component, ViewChild } from "@angular/core";
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { HttpService } from "../../services/http.services";
import { InfiniteScrollService } from "../../services/infiniteScroll.services";
import { navItems } from "../../_nav";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
})
export class DefaultLayoutComponent implements AfterViewInit {
  public sidebarMinimized = false;
  public navItems = navItems;
  resetFlag: boolean = false;
  @ViewChild("mainEle") mainEle;

  constructor(
    private httpService: HttpService,
    private router: Router,
    public infiniteScrollService: InfiniteScrollService
  ) {}

  ngAfterViewInit(): void {
    if (!this.resetFlag) {
      this.resetFlag = true;
      console.log(
        "main",
        this.mainEle,
        this.mainEle.nativeElement.scrollHeight,
        this.mainEle.nativeElement.scrollTop,
        this.mainEle.nativeElement.clientHeight
      );
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        console.log("main", this.mainEle);
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });
  }

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
