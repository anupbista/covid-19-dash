import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ApiService } from '../../../services/api.service';
import * as moment from 'moment';

@Component({
	selector: 'app-line-chart',
	templateUrl: './line-chart.component.html',
	styleUrls: [ './line-chart.component.scss' ]
})
export class LineChartComponent implements OnInit {

	public lineChartData = [];
  private lineChart: am4charts.XYChart;
  isLoading: boolean = false;

	constructor(private _apiService: ApiService) {
		am4core.useTheme(am4themes_animated);
	}

	ngOnInit(): void {
		this.getLineChartData();
	}

	ngOnDestroy(): void {
		if (this.lineChart) {
			this.lineChart.dispose();
		}
	}

	async getLineChartData() {
    this.isLoading = true;
		// get data from api
		this.lineChartData = [];
    let data = await this._apiService.getLineChartData();
    
		for (var key in  data.body.result) {
			// skip loop if the property is from prototype
			if (! data.body.result.hasOwnProperty(key)) continue;
      let cdata= {
        date: key,
        confirmed: 0,
				recovered: 0,
				deaths: 0
      };
			var obj = data.body.result[key];
			for (var prop in obj) {
				// skip loop if the property is from prototype
				if (!obj.hasOwnProperty(prop)) continue;
        cdata[prop] = obj[prop];
      }
      this.lineChartData.push(cdata);
		}
		// Create chart instance
		this.lineChart = am4core.create('chartdiv', am4charts.XYChart);
		// Increase contrast by taking evey second color
		this.lineChart.colors.step = 2;

		// Add data
		this.lineChart.data = this.generateChartData();

		// Create axes
		let dateAxis = this.lineChart.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.minGridDistance = 50;

		this.createAxisAndSeries('confirmed', 'Confirmed', false, 'circle');
		this.createAxisAndSeries('active', 'Active', true, 'triangle');
		this.createAxisAndSeries('recovered', 'Recovered', true, 'rectangle');
		this.createAxisAndSeries('deaths', 'Deaths', true, 'rectangle');

		// Add legend
		this.lineChart.legend = new am4charts.Legend();

		// Add cursor
    this.lineChart.cursor = new am4charts.XYCursor();
    this.isLoading = false;
	}

	// generate some random data, quite different range
	generateChartData() {
    let chartData = [];
		for (var i = this.lineChartData.length-20; i < this.lineChartData.length; i++) {
			chartData.push({
				date: new Date(this.lineChartData[i].date),
				confirmed: this.lineChartData[i].confirmed,
				active: this.lineChartData[i].confirmed - this.lineChartData[i].recovered - this.lineChartData[i].deaths,
				recovered: this.lineChartData[i].recovered,
				deaths: this.lineChartData[i].deaths
			});
    }
		return chartData;
	}

	// Create series
	createAxisAndSeries(field, name, opposite, bullet) {
		let valueAxis: any = this.lineChart.yAxes.push(new am4charts.ValueAxis());
		if (this.lineChart.yAxes.indexOf(valueAxis) != 0) {
			valueAxis.syncWithAxis = this.lineChart.yAxes.getIndex(0);
		}

		let series = this.lineChart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = field;
    series.dataFields.dateX = 'date';
    series.strokeWidth = 2;
    series.stroke = am4core.color("#ff0000");
		series.yAxis = valueAxis;
		series.name = name;
		series.tooltipText = '{name}: [bold]{valueY}[/]';
		series.tensionX = 0.8;
		series.showOnInit = true;

		let interfaceColors = new am4core.InterfaceColorSet();
		switch (bullet) {
			case 'triangle':
				let bullets = series.bullets.push(new am4charts.Bullet());
				bullets.width = 12;
				bullets.height = 12;
				bullets.horizontalCenter = 'middle';
				bullets.verticalCenter = 'middle';

				let triangle = bullets.createChild(am4core.Triangle);
				triangle.stroke = am4core.color("#ff0000");
        triangle.strokeWidth = 0;
        triangle.fill = am4core.color("#ff0000");
				triangle.direction = 'top';
				triangle.width = 12;
				triangle.height = 12;
				break;
			case 'rectangle':
				let bullet2 = series.bullets.push(new am4charts.Bullet());
				bullet2.width = 10;
				bullet2.height = 10;
				bullet2.horizontalCenter = 'middle';
				bullet2.verticalCenter = 'middle';

				let rectangle = bullet2.createChild(am4core.Rectangle);
				rectangle.stroke = interfaceColors.getFor('background');
				rectangle.strokeWidth = 2;
				rectangle.width = 10;
				rectangle.height = 10;
				break;
			default:
				let bullet = series.bullets.push(new am4charts.CircleBullet());
				bullet.circle.stroke = interfaceColors.getFor('background');
				bullet.circle.strokeWidth = 2;
				break;
		}

		valueAxis.renderer.line.strokeOpacity = 1;
		valueAxis.renderer.line.strokeWidth = 2;
		valueAxis.renderer.line.stroke = series.stroke;
		valueAxis.renderer.labels.template.fill = series.stroke;
		valueAxis.renderer.opposite = opposite;
	}
}
