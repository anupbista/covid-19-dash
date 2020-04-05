import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  constructor(public _commonService: CommonService) { }

  ngOnInit(): void {
  }

  onDarkModeSwitched({ checked }: MatSlideToggleChange) {
    this._commonService.isDarkMode = checked;
    this.darkModeSwitched.emit(checked);
  }

  launchWHO(){
    window.open(
      'https://www.who.int/health-topics/coronavirus',
      '_blank'
    );
  }

  launchDonate(){
    window.open(
      'https://covid19responsefund.org/',
      '_blank'
    );
  }

}
