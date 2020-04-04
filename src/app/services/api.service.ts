import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // https://github.com/OssamaRafique/Corona-Statistics-And-Tracker-Dashboard-Angular-9
  private CORONASTATISTICS_LIVE = "https://api.coronastatistics.live/";

  constructor(private _httpService: HttpService) { }

  getCaseCounts(){
    return this._httpService.apiHttpGet(this.CORONASTATISTICS_LIVE, 'all');
  }

  getCountryData(){
    return this._httpService.apiHttpGet(this.CORONASTATISTICS_LIVE, 'countries');
  }

  getSingleCountryData(countryname){
    return this._httpService.apiHttpGet(this.CORONASTATISTICS_LIVE, 'countries/' + countryname);
  }

  getLineChartData(){
    return this._httpService.apiHttpGet(this.CORONASTATISTICS_LIVE, 'timeline/global');
  }

}
