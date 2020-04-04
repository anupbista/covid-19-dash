import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-daily-updates',
  templateUrl: './daily-updates.component.html',
  styleUrls: ['./daily-updates.component.scss']
})
export class DailyUpdatesComponent implements OnInit {

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
			let data = await this._apiService.getLineChartData();
      let keys = Object.keys(data.body);
      let tempKeys = [];
      tempKeys.push(keys.pop());
      tempKeys.push(keys.pop());
      let tempData = [];
			tempKeys.forEach(element => {
        let item = data.body[element];
        item.active = item.cases - item.recovered - item.deaths
        tempData.push(item);
      });
      let casesChange = ((tempData[0].cases - tempData[1].cases)/tempData[1].cases)*100;
      let deathChange = ((tempData[0].deaths - tempData[1].deaths)/tempData[1].deaths)*100;
      let activeChange = ((tempData[0].active - tempData[1].active)/tempData[1].active)*100;
      let recoveredChange = ((tempData[0].recovered - tempData[1].recovered)/tempData[1].recovered)*100;
      this.data = {
        cases: tempData[0].cases - tempData[1].cases,
        casesChange: Number(casesChange.toFixed(1)),
        deaths: tempData[0].deaths - tempData[1].deaths,
        deathChange: Number(deathChange.toFixed(1)),
        recovered: tempData[0].recovered - tempData[1].recovered,
        recoveredChange: Number(recoveredChange.toFixed(1)),
        active: tempData[0].active - tempData[1].active,
        activeChange: Number(activeChange.toFixed(1)),
      }
      console.log(this.data)
      this.isLoading = false;
    } catch (error) {
      this.error = true;
      this.isLoading = false;
    }
  }

}
