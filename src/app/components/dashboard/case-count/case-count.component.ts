import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-case-count',
  templateUrl: './case-count.component.html',
  styleUrls: ['./case-count.component.scss']
})
export class CaseCountComponent implements OnInit {

  data: any = null;
  isLoading: boolean = false;
  error: boolean = false;
  constructor(private _apiService: ApiService, private _commonService: CommonService) { }

  ngOnInit(): void {
    this.error = false;
    this.init();
  }
  
  async init(){
    try {
      this.isLoading = true;
      let data = await this._apiService.getCaseCounts();
      this.data = data.body;
      this._commonService.lastUpdatedDate = moment(new Date(data.body.updated)).format("YYYY-MM-DD");
      this.isLoading = false;
    } catch (error) {
      this.error = true;
      this.isLoading = false;
    }
  }

}
