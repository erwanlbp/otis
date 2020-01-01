import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CounterEvent } from "../../interfaces/counter-event.interface";

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
    selector: 'app-counter-chart',
    templateUrl: './counter-chart.component.html',
    styleUrls: ['./counter-chart.component.scss'],
})
export class CounterChartComponent implements OnInit {

    @Input() events: CounterEvent[];

    public options: any = {
        chart: {
            type: 'scatter',
            height: 700
        },
        title: {
            text: 'Sample Scatter Plot'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter: (pt) => {
                return 'x: ' + Highcharts.dateFormat('%e %b %y %H:%M:%S', pt.now.x) + 'y: ' + pt.now.y.toFixed(2);
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: (value) => {
                    return Highcharts.dateFormat('%e %b %y', value);
                }
            }
        },
        series: [
            {
                name: 'Normal',
                turboThreshold: 500000,
                data: [[new Date('2018-01-25 18:38:31').getTime(), 2]]
            },
            {
                name: 'Abnormal',
                turboThreshold: 500000,
                data: [[new Date('2018-02-05 18:38:31').getTime(), 7]]
            }
        ]
    };

    constructor() {
    }

    ngOnInit() {
        Highcharts.chart('container', this.options);
    }
}
