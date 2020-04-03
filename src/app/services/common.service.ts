import { Injectable } from '@angular/core';
import { EventEmitter } from 'protractor';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isSmallDevice: boolean = false;

  constructor() { }

}
