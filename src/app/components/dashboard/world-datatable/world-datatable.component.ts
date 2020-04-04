import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ApiService } from '../../../services/api.service';
import getCountryName from '../../../helper/countryname';
import getCountryISO2 from '../../../helper/countrycode';
import { CommonService } from '../../../services/common.service';
import {MatPaginator} from '@angular/material/paginator';
import getCountryCodeFromName from 'src/app/helper/countrycodename';

@Component({
  selector: 'app-world-datatable',
  templateUrl: './world-datatable.component.html',
  styleUrls: ['./world-datatable.component.scss']
})
export class WorldDatatableComponent implements OnInit {

  displayedColumns: string[] = ['country', 'cases', 'active', 'recovered', 'deaths'];
  dataSource = new MatTableDataSource();
  error: boolean = false;

  isLoading: boolean = false;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private _apiService: ApiService, private _commonService: CommonService) {
    
  }

  ngOnInit() {
    this.error = false;
    this.getDataTable();
  }

  async getDataTable(){
    try {
      this.isLoading = true;
      let data = await this._apiService.getCountryData();
      let dataTableData= [];
      data.body.forEach(element => {
        let country = { 
          "code":getCountryCodeFromName(element.country),
          "country": element.country,
          "cases": element.cases,
          "deaths": element.deaths,
          "recovered": element.recovered,
          "active": element.cases - element.recovered - element.deaths
        };
        dataTableData.push(country);
      });
      this.dataSource = new MatTableDataSource(dataTableData);
      setTimeout(() => {
        this.dataSource.sort = this.sort; 
        this.dataSource.paginator = this.paginator;
      });
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.error = true;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}
