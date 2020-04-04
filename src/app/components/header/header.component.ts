import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public _commonService: CommonService) { }

  ngOnInit(): void {
  }

  launchWHO(){
    window.open(
      'https://www.who.int/health-topics/coronavirus',
      '_blank'
    );
  }

}
