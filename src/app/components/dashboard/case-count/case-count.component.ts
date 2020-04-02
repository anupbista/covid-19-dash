import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-case-count',
  templateUrl: './case-count.component.html',
  styleUrls: ['./case-count.component.scss']
})
export class CaseCountComponent implements OnInit {

  data: any = null;
  isLoading: boolean = false;

  constructor(private _apiService: ApiService) { }

  ngOnInit(): void {
    this.init();
  }
  
  async init(){
    this.isLoading = true;
    let data = await this._apiService.getCaseCounts();
    this.data = data.body;
    this.isLoading = false;
  }

}
