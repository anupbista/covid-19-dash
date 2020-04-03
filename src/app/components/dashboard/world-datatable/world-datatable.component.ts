import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ApiService } from '../../../services/api.service';
import getCountryName from '../../../helper/countryname';
import getCountryISO2 from '../../../helper/countrycode';
import { CommonService } from '../../../services/common.service';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-world-datatable',
  templateUrl: './world-datatable.component.html',
  styleUrls: ['./world-datatable.component.scss']
})
export class WorldDatatableComponent implements OnInit {

  displayedColumns: string[] = ['country', 'cases', 'active', 'recovered', 'deaths'];
  dataSource = new MatTableDataSource();

  isLoading: boolean = false;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private _apiService: ApiService, private _commonService: CommonService) {
    
  }

  ngOnInit() {
    this.getDataTable();
  }

  async getDataTable(){
    this.isLoading = true;
    let data = await this._apiService.getCountryData();
    let dataTableData= [];
    data.body.result.forEach(element => {
      let code = Object.keys(element)[0];
      let country = { 
        "code": getCountryISO2(code),
        "country": getCountryName(getCountryISO2(code)),
        "cases": element[code].confirmed,
        "deaths": element[code].deaths,
        "recovered": element[code].recovered,
        "active": element[code].confirmed - element[code].recovered - element[code].deaths
      };
      dataTableData.push(country);
    });
    console.log(dataTableData)
    this.dataSource = new MatTableDataSource(dataTableData);
    setTimeout(() => {
      this.dataSource.sort = this.sort; 
      this.dataSource.paginator = this.paginator;
    });
    this.isLoading = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}
