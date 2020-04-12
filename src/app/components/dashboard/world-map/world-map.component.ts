import { Component, OnInit,NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { ApiService } from '../../../services/api.service';
import getCountryCodeFromName from '../../../helper/countrycodename';
import am4themes_material from "@amcharts/amcharts4/themes/material";
import { CommonService } from '../../../services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss']
})
export class WorldMapComponent implements OnInit {

  public worldMapMode: string = 'confirm';

  mapData = [];
  private mapChart: am4maps.MapChart;
  private polygonSeries: am4maps.MapPolygonSeries;

  isLoading: boolean = false;
  error: boolean = false;
  themeChangeSubscription: Subscription;

  constructor(private _apiService: ApiService, private zone: NgZone, private _commonService: CommonService) {
    // am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);
    am4core.options.onlyShowOnViewport = true;
  }

  ngOnInit(): void {
    this.error = false;
    this.getWorldData();
    this.themeChangeSubscription = this._commonService.themeChanged.subscribe( change => {
      this.changeMapTheme();
    })
  }


  initWorldMap(){
    if (this.mapChart) {
      this.mapChart.dispose();
    }
    this.mapChart = am4core.create("mapdiv", am4maps.MapChart);
    this.mapData.forEach(element => {
      element.color = this.worldMapMode == 'confirm' ? '#8888ff' : this.worldMapMode == 'active' ? '#e4f67c' :  this.worldMapMode == 'recovered' ? '#64e87a' : '#e86464';
    });
    let title = this.mapChart.titles.create();
    // title.text = "[bold font-size: 20]Population of the World in 2011[/]\nsource: Gapminder";
    title.textAlign = "middle";

    // Set map definition
    this.mapChart.geodata = am4geodata_worldLow;
    this.mapChart.logo.height = -15;

    // Set projection
    this.mapChart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    this.polygonSeries = this.mapChart.series.push(new am4maps.MapPolygonSeries());
    this.polygonSeries.exclude = ["AQ"];
    this.polygonSeries.useGeodata = true;
    this.polygonSeries.nonScalingStroke = true;
    this.polygonSeries.strokeWidth = 0.5;
    this.polygonSeries.calculateVisualCenter = true;

    let polygonTemplate = this.polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    // polygonTemplate.fill = am4core.color("#c7c7c7");
    // polygonTemplate.stroke = am4core.color("#c7c7c7");
   this.mapChart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;
   if(this._commonService.isDarkMode){
    this.mapChart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#424242");
  }
    let imageSeries = this.mapChart.series.push(new am4maps.MapImageSeries());
    imageSeries.data = this.mapData;
    imageSeries.dataFields.value = this.worldMapMode == 'confirm' ? 'value' : this.worldMapMode == 'active' ? 'active' :  this.worldMapMode == 'recovered' ? 'recovered' : 'deaths';
    
    let imageTemplate = imageSeries.mapImages.template;
    imageTemplate.nonScaling = true
    
    let circle = imageTemplate.createChild(am4core.Circle);
    // circle.fillOpacity = 0.7;
    circle.propertyFields.fill = "color";
    // circle.propertyFields.fillOpacity = '0.5';
    circle.propertyFields.strokeWidth = '0';
    circle.tooltipText = this.worldMapMode == 'confirm' ? `{name}
    Confirmed: [bold]{value}[/]` : this.worldMapMode == 'active' ? `{name}
    Active: [bold]{active}[/]` :  this.worldMapMode == 'recovered' ? `{name}
    Recovered: [bold]{recovered}[/]` : `{name}
    Deaths: [bold]{deaths}[/]`;

    this.mapChart.events.on("ready",()=>{
      this.isLoading = false;
    })

    imageSeries.heatRules.push({
      "target": circle,
      "property": "radius",
      "min": 4,
      "max": 30,
      "dataField": "value"
    })
    
    imageTemplate.adapter.add("latitude", (latitude, target) => {
      let c:any = target.dataItem.dataContext;
      let polygon = this.polygonSeries.getPolygonById(c.id);
      if(polygon){
        return polygon.visualLatitude;
       }
       return latitude;
    })
    
    imageTemplate.adapter.add("longitude", (longitude, target) => {
      let c:any = target.dataItem.dataContext;
      let polygon = this.polygonSeries.getPolygonById(c.id);
      if(polygon){
        return polygon.visualLongitude;
       }
       return longitude;
    })

    this.isLoading = false;
  }

  async getWorldData(){
    try {
      this.isLoading = true;
      let data = await this._apiService.getCountryData();
      data.body.forEach(element => {
        let country = { 
          "id": getCountryCodeFromName(element.country),
          "name": element.country,
          "value": element.cases,
          "deaths": element.deaths,
          "recovered": element.recovered,
          "active": element.cases - element.deaths - element.recovered,
          "color": this.worldMapMode == 'confirm' ? '#8888ff' : this.worldMapMode == 'active' ? '#e4f67c' :  this.worldMapMode == 'recovered' ? '#64e87a' : '#e86464'
        };
        this.mapData.push(country);
      });
      this.isLoading = false;
      this.initWorldMap();
    } catch (error) {
      this.isLoading = false;
      this.error = true;
    }
  }

  toggleView(event){
    this.worldMapMode = event.value;
    // this.initWorldMap();
    this.mapData.forEach(element => {
      element.color = this.worldMapMode == 'confirm' ? '#8888ff' : this.worldMapMode == 'active' ? '#e4f67c' :  this.worldMapMode == 'recovered' ? '#64e87a' : '#e86464';
    });
    this.mapChart.series.pop();
    let imageSeries = this.mapChart.series.push(new am4maps.MapImageSeries());
    imageSeries.data = this.mapData;
    imageSeries.dataFields.value = this.worldMapMode == 'confirm' ? 'value' : this.worldMapMode == 'active' ? 'active' :  this.worldMapMode == 'recovered' ? 'recovered' : 'deaths';
    
    let imageTemplate = imageSeries.mapImages.template;
    imageTemplate.nonScaling = true
    
    let circle = imageTemplate.createChild(am4core.Circle);
    // circle.fillOpacity = 0.7;
    circle.propertyFields.fill = "color";
    // circle.propertyFields.fillOpacity = '0.5';
    circle.propertyFields.strokeWidth = '0';
    circle.tooltipText = this.worldMapMode == 'confirm' ? `{name}
    Confirmed: [bold]{value}[/]` : this.worldMapMode == 'active' ? `{name}
    Active: [bold]{active}[/]` :  this.worldMapMode == 'recovered' ? `{name}
    Recovered: [bold]{recovered}[/]` : `{name}
    Deaths: [bold]{deaths}[/]`;

    this.mapChart.events.on("ready",()=>{
      this.isLoading = false;
    })

    imageSeries.heatRules.push({
      "target": circle,
      "property": "radius",
      "min": 4,
      "max": 30,
      "dataField": "value"
    })
    imageTemplate.adapter.add("latitude", (latitude, target) => {
      let c:any = target.dataItem.dataContext;
      let polygon = this.polygonSeries.getPolygonById(c.id);
      if(polygon){
        return polygon.visualLatitude;
       }
       return latitude;
    })
    
    imageTemplate.adapter.add("longitude", (longitude, target) => {
      let c:any = target.dataItem.dataContext;
      let polygon = this.polygonSeries.getPolygonById(c.id);
      if(polygon){
        return polygon.visualLongitude;
       }
       return longitude;
    })

    
  }

  ngOnDestroy() {
    this.themeChangeSubscription.unsubscribe();
    this.zone.runOutsideAngular(() => {
      if (this.mapChart) {
        this.mapChart.dispose();
      }
    });
  }

  changeMapTheme(){
    if(this._commonService.isDarkMode){
      this.mapChart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#424242");
    }
    else{
      this.mapChart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#ffffff");
    }
  }

}
