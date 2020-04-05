import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from '../../services/common.service';
import getCountryCodeFromName from 'src/app/helper/countrycodename';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_material from '@amcharts/amcharts4/themes/material';
import getCountryNameSanited from 'src/app/helper/countrynamesanitize';

@Component({
	selector: 'app-countrydata',
	templateUrl: './countrydata.component.html',
	styleUrls: [ './countrydata.component.scss' ]
})
export class CountrydataComponent implements OnInit {
	countryname: string = null;

	// casecount
	data: any = null;
	isLoadingCaseCount: boolean = false;
	errorCaseCount: boolean = false;

	// pieChart
	pieChart: am4charts.PieChart;

	// lineChart
	lineChart: am4charts.XYChart;
	lineChartData = [];
	isLoadingLineChart: boolean = false;
	errorLineChart: boolean = false;

	constructor(private route: ActivatedRoute, private _apiService: ApiService, private _commonService: CommonService) {
		am4core.useTheme(am4themes_animated);
		am4core.useTheme(am4themes_material);
	}

	ngOnInit(): void {
		this.countryname = this.route.snapshot.paramMap.get('countryname');
		if (this.countryname) {
			this._commonService.country = this.countryname;
			this._commonService.countryCode = getCountryCodeFromName(this.countryname);
		}
		this.errorCaseCount = false;
		this.errorLineChart = false;
		this.initCaseCount();
		this.generateLineChartData();
	}

	async initCaseCount() {
		try {
			this.isLoadingCaseCount = true;
			let data = await this._apiService.getSingleCountryData(getCountryNameSanited(this.countryname.toLowerCase()));
			this.data = data.body;
			this.getPieChartData();
			this.isLoadingCaseCount = false;
		} catch (error) {
			this.errorCaseCount = true;
			this.isLoadingCaseCount = false;
		}
	}

	async getPieChartData() {
		try {
			let total = this.data.cases;
			// Create chart instance
			this.pieChart = am4core.create('chartdiv', am4charts.PieChart);
			// Set data
			let selected;
			let types = [
				{
					type: 'Active',
					percent: this.data.active / total * 100,
					value: this.data.active,
					color: '#e4f67c',
					subs: [
						{
							type: 'Critical',
							percent: this.data.critical / total * 100,
							value: this.data.critical,
							color: '#ffbf6e'
						},
						{
							type: 'Active',
							percent: (this.data.active - this.data.critical) / total * 100,
							value: this.data.active - this.data.critical,
							color: '#e4f67c'
						}
					]
				},
				{
					type: 'Recovered',
					percent: this.data.recovered / total * 100,
					value: this.data.recovered,
					color: '#64e87a',
					subs: [
						{
							type: 'Recovered',
							percent: this.data.recovered / total * 100,
							value: this.data.recovered,
							color: '#64e87a'
						}
					]
				},
				{
					type: 'Deaths',
					percent: this.data.deaths / total * 100,
					value: this.data.deaths,
					color: '#e86464',
					subs: [
						{
							type: 'Deaths',
							percent: this.data.deaths / total * 100,
							value: this.data.deaths,
							color: '#e86464'
						}
					]
				}
			];

			// Add data
			this.pieChart.data = this.generateChartData(selected, types);
			this.pieChart.legend = new am4charts.Legend();
			this.pieChart.legend.itemContainers.template.clickable = false;
			this.pieChart.legend.itemContainers.template.focusable = false;
			// Add and configure Series
			let pieSeries = this.pieChart.series.push(new am4charts.PieSeries());
			pieSeries.dataFields.value = 'value';
			pieSeries.dataFields.category = 'type';
			pieSeries.slices.template.propertyFields.fill = 'color';
			pieSeries.slices.template.propertyFields.isActive = 'pulled';
			pieSeries.slices.template.strokeWidth = 0;
			pieSeries.labels.template.text = "{percent.formatNumber('#.0')}%";
			pieSeries.labels.template.disabled = false;
			pieSeries.slices.template.events.on('hit', (event) => {
				if (event.target.dataItem.dataContext['id'] != undefined) {
					selected = event.target.dataItem.dataContext['id'];
				} else {
					selected = undefined;
				}
				this.pieChart.data = this.generateChartData(selected, types);
			});

			this.pieChart.logo.height = -15;
		} catch (error) {
			this.isLoadingCaseCount = false;
			this.errorCaseCount = true;
		}
	}

	generateChartData(selected, types) {
		let chartData = [];
		for (var i = 0; i < types.length; i++) {
			if (i == selected) {
				for (var x = 0; x < types[i].subs.length; x++) {
					chartData.push({
						type: types[i].subs[x].type,
						percent: types[i].subs[x].percent,
						value: types[i].subs[x].value,
						color: types[i].subs[x].color,
						pulled: true
					});
				}
			} else {
				chartData.push({
					type: types[i].type,
					percent: types[i].percent,
					value: types[i].value,
					color: types[i].color,
					id: i
				});
			}
		}
		return chartData;
	}

	ngOnDestroy(): void {
		if (this.pieChart) this.pieChart.dispose();
		if (this.lineChart) this.lineChart.dispose();
	}

	initLineChart() {
		if(this.lineChart) this.lineChart.dispose();
		// Create chart instance
		this.lineChart = am4core.create('lineChartDiv', am4charts.XYChart);

		// Add data
		this.lineChart.data = this.lineChartData;

		// Create axes
		let dateAxis = this.lineChart.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.minGridDistance = 50;

		let valueAxis = this.lineChart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.renderer.disabled = this._commonService.isSmallDevice;
		
		// Create series
		let series = this.createLineSeries('cases', '#8888ff');
		series = this.createLineSeries('active', '#e4f67c');
		series = this.createLineSeries('recovered', '#64e87a');
		series = this.createLineSeries('deaths', '#e86464');

		// Add legend
		this.lineChart.legend = new am4charts.Legend();
		this.lineChart.logo.height = -15;
		// Add cursor
		this.lineChart.cursor = new am4charts.XYCursor();
		// Add scrollbar
		if(!this._commonService.isSmallDevice){
			let scrollbarX = new am4charts.XYChartScrollbar();
			scrollbarX.series.push(series);
			this.lineChart.scrollbarX = scrollbarX;
		}
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
		series.tooltip.background.fillOpacity = 0.5;
		series.tooltip.label.padding(12, 12, 12, 12);
		return series;
	}

	async generateLineChartData() {
		try {
			this.isLoadingLineChart = true;
			let res = await this._apiService.getLineChartPerCountry(getCountryNameSanited(this.countryname.toLowerCase()));
			this.lineChartData = [];
			res.body.data.timeline.forEach((element) => {
				this.lineChartData.push({
					date: new Date(element.date),
					cases: element.cases,
					recovered: element.recovered,
					active: element.cases - element.recovered - element.deaths,
					deaths: element.deaths
				});
			});
			this.initLineChart();
			this.isLoadingLineChart = false;
		} catch (error) {
			this.isLoadingLineChart = false;
			this.errorLineChart = true;
		}
	}

}
