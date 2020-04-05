import { Injectable } from '@angular/core';
import { EventEmitter } from 'protractor';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isSmallDevice: boolean = false;
  routeLoading: boolean = false;

  country: string = null;
  countryCode: string = null;
  lastUpdatedDate: string = null;

  constructor() { }

}
