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
  error: boolean = false;
  constructor(private _apiService: ApiService) { }

  ngOnInit(): void {
    this.error = false;
    this.init();
  }
  
  async init(){
    try {
      this.isLoading = true;
      let data = await this._apiService.getCaseCounts();
      this.data = data.body;
      this.isLoading = false;
    } catch (error) {
      this.error = true;
      this.isLoading = false;

    }
  }

}
