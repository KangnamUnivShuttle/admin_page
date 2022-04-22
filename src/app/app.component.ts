import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpService } from './services/http.services';
import { LoadingService } from './services/loading.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: 'app.component.html',
  // template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.css'],
  providers: [IconSetService],
})
export class AppComponent implements OnInit, OnDestroy {

  logginSubscription: Subscription;
  loadingStatus: boolean;

  constructor(
    private router: Router,
    public iconSet: IconSetService,
    private httpSerivce: HttpService,
    private loadingService: LoadingService
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
    this.loadingStatus = false;
  }

  ngOnDestroy(): void {
    if(this.logginSubscription && !this.logginSubscription.closed) {
      this.logginSubscription.unsubscribe()
    }
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.logginSubscription = this.httpSerivce.isAuthorized.subscribe((status) => {
      if (!status) {
        console.warn(`[AppComponent] [ngOnInit-IsAuthorized] status is false`)
        this.router.navigate(['/login'])
      }
    })

    this.loadingService.loading.subscribe((status) => {
      this.loadingStatus = status
    })
  }
}
