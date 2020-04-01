import { Component, OnInit,NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { ApiService } from '../../../services/api.service';
import getCountryName from '../../../helper/countryname';
import getCountryISO2 from '../../../helper/countrycode';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss']
})
export class WorldMapComponent implements OnInit {

  mapData = [];

  constructor(private _apiService: ApiService) {
    am4core.useTheme(am4themes_animated);
  }

  ngOnInit(): void {
    this.getWorldData();
  }

  async getWorldData(){
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    let data = await this._apiService.getCountryData();
    data.body.result.forEach(element => {
      let code = Object.keys(element)[0];

      let country = { 
        "id": getCountryISO2(code),
        "name": getCountryName(getCountryISO2(code)),
        "value": element[code].confirmed,
        "deaths": element[code].deaths,
        "recovered": element[code].recovered,
        "color": chart.colors.getIndex(element[code].confirmed) 
      };
      this.mapData.push(country);
    });

    let title = chart.titles.create();
    // title.text = "[bold font-size: 20]Population of the World in 2011[/]\nsource: Gapminder";
    title.textAlign = "middle";

    // Set map definition
    chart.geodata = am4geodata_worldLow;
    chart.logo.height = -15;

    // Set projection
    chart.projection = new am4maps.projections.Miller();
    
    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.exclude = ["AQ"];
    polygonSeries.useGeodata = true;
    polygonSeries.nonScalingStroke = true;
    polygonSeries.strokeWidth = 0.5;
    polygonSeries.calculateVisualCenter = true;
    
    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.data = this.mapData;
    imageSeries.dataFields.value = "value";
    
    let imageTemplate = imageSeries.mapImages.template;
    imageTemplate.nonScaling = true
    
    let circle = imageTemplate.createChild(am4core.Circle);
    circle.fillOpacity = 0.7;
    circle.propertyFields.fill = "color";
    circle.tooltipText = `{name}: [bold]{value}[/] 
    Deaths: [bold]{deaths}[/]
    Recovered: [bold]{recovered}[/]`;
    imageSeries.heatRules.push({
      "target": circle,
      "property": "radius",
      "min": 4,
      "max": 30,
      "dataField": "value"
    })
    
    imageTemplate.adapter.add("latitude", (latitude, target) => {
      let c:any = target.dataItem.dataContext;
      let polygon = polygonSeries.getPolygonById(c.id);
      if(polygon){
        return polygon.visualLatitude;
       }
       return latitude;
    })
    
    imageTemplate.adapter.add("longitude", (longitude, target) => {
      let c:any = target.dataItem.dataContext;
      let polygon = polygonSeries.getPolygonById(c.id);
      if(polygon){
        return polygon.visualLongitude;
       }
       return longitude;
    })
  }

}
