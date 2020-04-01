import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _httpService: HttpService) { }

  getCaseCounts(){
    return this._httpService.apiHttpGet('global');
  }

  getCountryData(){
    return this._httpService.apiHttpGet('global/latest');
  }
}
