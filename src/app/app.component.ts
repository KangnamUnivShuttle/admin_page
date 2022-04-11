import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpService } from './services/http.services';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService],
})
export class AppComponent implements OnInit, OnDestroy {

  logginSubscription: Subscription;

  constructor(
    private router: Router,
    public iconSet: IconSetService,
    private httpSerivce: HttpService
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
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
  }
}
