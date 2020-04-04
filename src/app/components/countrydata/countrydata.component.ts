import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from '../../services/common.service';
import getCountryCodeFromName from 'src/app/helper/countrycodename';

@Component({
  selector: 'app-countrydata',
  templateUrl: './countrydata.component.html',
  styleUrls: ['./countrydata.component.scss']
})
export class CountrydataComponent implements OnInit {

  countryname: string = null;
  data: any = null;
  isLoadingCaseCount: boolean = false;
  errorCaseCount: boolean = false;

  constructor(private route: ActivatedRoute, private _apiService: ApiService, private _commonService: CommonService) { }

  ngOnInit(): void {
    this.countryname = this.route.snapshot.paramMap.get('countryname');
    if(this.countryname){
      this._commonService.country = this.countryname;
      this._commonService.countryCode = getCountryCodeFromName(this.countryname);
    }
    this.errorCaseCount = false;
    this.initCaseCount();
  }

  async initCaseCount(){
    try {
      this.isLoadingCaseCount = true;
      let data = await this._apiService.getSingleCountryData(this.countryname);
      this.data = data.body;
      this.isLoadingCaseCount = false;
    } catch (error) {
      this.errorCaseCount = true;
      this.isLoadingCaseCount = false;
    }
  }

}
