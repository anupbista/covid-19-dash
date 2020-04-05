import { Component, HostBinding } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { CommonService } from './services/common.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(breakpointObserver: BreakpointObserver, private _commonService: CommonService, private router: Router) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this._commonService.isSmallDevice = breakpointObserver.isMatched('(max-width: 599px)');
      }
    });

    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this._commonService.routeLoading = true;
          console.log('true')
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this._commonService.routeLoading = false;
          console.log('false')
          break;
        }
        default: {
          break;
        }
      }
    });

  }

}
