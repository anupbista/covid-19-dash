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
	isLoading: boolean = false;
	error: boolean = false;

	constructor(private _apiService: ApiService, private _commonService: CommonService) {
		am4core.useTheme(am4themes_animated);
		am4core.useTheme(am4themes_material);
	}
	
	ngOnInit(): void {
		this.error = false;
		this.getLineChartData();
	}

	ngOnDestroy(): void {
		if (this.lineChart) {
			this.lineChart.dispose();
		}
	}

	async getLineChartData() {
		try {
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
			// Create chart instance
			this.lineChart = am4core.create('chartdiv', am4charts.XYChart);
			this.lineChart.logo.height = -10000000;
			// Increase contrast by taking evey second color
			this.lineChart.colors.step = 2;

			// Add data
			this.lineChart.data = this.generateChartData();

			// Create axes
			let dateAxis = this.lineChart.xAxes.push(new am4charts.DateAxis());
			dateAxis.renderer.minGridDistance = 50;

			this.createAxisAndSeries('cases', 'Confirmed', false, 'circle');
			this.createAxisAndSeries('active', 'Active', true, 'triangle');
			this.createAxisAndSeries('recovered', 'Recovered', true, 'rectangle');
			this.createAxisAndSeries('deaths', 'Deaths', true, 'square');

			// Add legend
			this.lineChart.legend = new am4charts.Legend();

			// Add cursor
			this.lineChart.cursor = new am4charts.XYCursor();
			this.isLoading = false;
		} catch (error) {
			this.isLoading = false;
			this.error = true;
		}
	}

	// generate some random data, quite different range
	generateChartData() {
		let chartData = [];
		for (var i = this.lineChartData.length - 20; i < this.lineChartData.length; i++) {
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

	// Create series
	createAxisAndSeries(field, name, opposite, bullet) {
		let valueAxis:any = this.lineChart.yAxes.push(new am4charts.ValueAxis());
		if (this.lineChart.yAxes.indexOf(valueAxis) != 0) {
			valueAxis.syncWithAxis = this.lineChart.yAxes.getIndex(0);
		}

		let series = this.lineChart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = field;
		series.dataFields.dateX = 'date';
		series.strokeWidth = 2;
		series.yAxis = valueAxis;
		series.name = name;
		series.tooltipText = '{name}: [bold]{valueY}[/]';
		series.tensionX = 0.8;
		series.showOnInit = true;
		switch (bullet) {
			case 'triangle':
				// active
				series.stroke = am4core.color('#e4f67c');
				series.fill =  am4core.color('#e4f67c');
				let bullets = series.bullets.push(new am4charts.Bullet());
				bullets.width = 12;
				bullets.height = 12;
				bullets.horizontalCenter = 'middle';
				bullets.verticalCenter = 'middle';

				let triangle = bullets.createChild(am4core.Triangle);
				triangle.stroke = am4core.color('#e4f67c');
				triangle.strokeWidth = 0;
				triangle.fill = am4core.color('#e4f67c');
				triangle.direction = 'top';
				triangle.width = 12;
				triangle.height = 12;
				break;
			case 'rectangle':
				// recovered
				series.stroke = am4core.color('#64e87a');
				series.fill =  am4core.color('#64e87a');
				let bullet2 = series.bullets.push(new am4charts.Bullet());
				bullet2.width = 10;
				bullet2.height = 10;
				bullet2.horizontalCenter = 'middle';
				bullet2.verticalCenter = 'middle';

				let rectangle = bullet2.createChild(am4core.Rectangle);
				rectangle.stroke = am4core.color('#64e87a');
				rectangle.strokeWidth = 0;
				rectangle.fill = am4core.color('#64e87a');
				rectangle.width = 10;
				rectangle.height = 10;
				break;
			case 'square':
				// deaths
				series.stroke = am4core.color('#e86464');
				series.fill =  am4core.color('#e86464');
				let bullet3 = series.bullets.push(new am4charts.Bullet());
				bullet3.width = 10;
				bullet3.height = 10;
				bullet3.horizontalCenter = 'middle';
				bullet3.verticalCenter = 'middle';

				let square = bullet3.createChild(am4core.Rectangle);
				square.stroke = am4core.color('#e86464');
				square.strokeWidth = 0;
				square.fill = am4core.color('#e86464');
				square.strokeWidth = 2;
				square.width = 10;
				square.height = 10;
				break;
			default:
				// cases
				series.stroke = am4core.color('#8888ff');
				series.fill =  am4core.color('#8888ff');
				let bullet = series.bullets.push(new am4charts.CircleBullet());
				bullet.circle.stroke = am4core.color('#8888ff');
				bullet.circle.strokeWidth = 0;
				break;
		}

		valueAxis.renderer.line.strokeOpacity = 1;
		valueAxis.renderer.line.strokeWidth = 2;
		valueAxis.renderer.line.stroke = series.stroke;
		valueAxis.renderer.labels.template.fill = series.stroke;
		valueAxis.renderer.opposite = opposite;
		valueAxis.renderer.disabled = this._commonService.isSmallDevice;
	}
}
