import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ApiService } from '../../../services/api.service';
import * as moment from 'moment';
import { CommonService } from '../../../services/common.service';
import am4themes_material from "@amcharts/amcharts4/themes/material";

@Component({
	selector: 'app-line-chart',
	templateUrl: './line-chart.component.html',
	styleUrls: [ './line-chart.component.scss' ]
})
export class LineChartComponent implements OnInit {
	public lineChartData = [];
	private lineChart: am4charts.XYChart;
	private valueAxis: am4charts.ValueAxis

	isLoading: boolean = false;
	isLogarithmicScale: boolean = false;
	error: boolean = false;

	constructor(private _apiService: ApiService, private _commonService: CommonService) {
		// am4core.useTheme(am4themes_animated);
		am4core.useTheme(am4themes_material);
		am4core.options.onlyShowOnViewport = true;
	}
	
	ngOnInit(): void {
		this.error = false;
		this.initLineChart();
	}

	ngOnDestroy(): void {
		if (this.lineChart) {
			this.lineChart.dispose();
		}
	}

	async initLineChart() {
		if(this.lineChart) this.lineChart.dispose();
		this.isLoading = true;
		// get data from api
		this.lineChartData = [];
		let data = await this._apiService.getLineChartData();

		for (var key in data.body) {
			// skip loop if the property is from prototype
			if (!data.body.hasOwnProperty(key)) continue;
			let cdata = {
				date: key,
				cases: 0,
				recovered: 0,
				deaths: 0
			};
			var obj = data.body[key];
			for (var prop in obj) {
				// skip loop if the property is from prototype
				if (!obj.hasOwnProperty(prop)) continue;
				cdata[prop] = obj[prop];
			}
			this.lineChartData.push(cdata);
		}
		this.lineChartData = this.generateChartData();
		// Create chart instance
		this.lineChart = am4core.create('lineChartDiv', am4charts.XYChart);

		// Add data
		this.lineChart.data = this.lineChartData;

		// Create axes
		let dateAxis = this.lineChart.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.minGridDistance = 50;
		dateAxis.groupData = true;
		this.valueAxis = this.lineChart.yAxes.push(new am4charts.ValueAxis());
		if(this.isLogarithmicScale){
			this.valueAxis.logarithmic = true;
			this.valueAxis.renderer.minGridDistance = 20;
		}
		
		// Create series
		let series = this.createLineSeries('cases', '#8888ff');
		series = this.createLineSeries('active', '#e4f67c');
		series = this.createLineSeries('recovered', '#64e87a');
		series = this.createLineSeries('deaths', '#e86464');

		// Add legend
		this.lineChart.legend = new am4charts.Legend();
		this.lineChart.logo.height = -1500;
		// Add cursor
		this.lineChart.cursor = new am4charts.XYCursor();
		// Add scrollbar
		if(!this._commonService.isSmallDevice){
			let scrollbarX = new am4charts.XYChartScrollbar();
			scrollbarX.series.push(series);
			this.lineChart.scrollbarX = scrollbarX;
		}
		this.isLoading = false;
	}

	createLineSeries(name, color){
		let series = this.lineChart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = name;
		series.dataFields.dateX = 'date';
		series.strokeWidth = 2;
		series.stroke = am4core.color(color);
		series.fill = am4core.color(color);
		series.minBulletDistance = 10;
		let fname = name.charAt(0).toUpperCase() + name.slice(1) + ' {valueY}';
		series.tooltipText = fname;
		series.tooltip.pointerOrientation = 'vertical';
		series.tooltip.background.cornerRadius = 20;
		series.legendSettings.labelText = name.charAt(0).toUpperCase() + name.slice(1);
		// series.tooltip.background.fillOpacity = 0.5;
		series.tooltip.label.padding(12, 12, 12, 12);
		return series;
	}


	// generate some random data, quite different range
	generateChartData() {
		let chartData = [];
		for (var i = 0; i < this.lineChartData.length; i++) {
			chartData.push({
				date: new Date(this.lineChartData[i].date),
				cases: this.lineChartData[i].cases,
				active:
					this.lineChartData[i].cases - this.lineChartData[i].recovered - this.lineChartData[i].deaths,
				recovered: this.lineChartData[i].recovered,
				deaths: this.lineChartData[i].deaths
			});
		}
		return chartData;
	}

	toggleScale(event){
		this.isLogarithmicScale = event.checked;
		if(this.isLogarithmicScale){
			this.valueAxis.logarithmic = true;
			this.valueAxis.renderer.minGridDistance = 20;
		}else{
			this.valueAxis.logarithmic = false;
			this.valueAxis.renderer.minGridDistance = 50;
		}
	}
	
}
