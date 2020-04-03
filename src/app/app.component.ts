import { Component, HostBinding } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(breakpointObserver: BreakpointObserver, private _commonService: CommonService) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this._commonService.isSmallDevice = breakpointObserver.isMatched('(max-width: 599px)');
      }
    });
  }

  launchWHO(){
    window.open(
      'https://www.who.int/health-topics/coronavirus',
      '_blank'
    );
  }

}
