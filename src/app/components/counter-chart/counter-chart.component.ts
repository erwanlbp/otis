import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Counter } from 'src/app/interfaces/counter';
import HC_exporting from 'highcharts/modules/exporting';
import Boost from 'highcharts/modules/boost';
import noData from 'highcharts/modules/no-data-to-display';
import More from 'highcharts/highcharts-more';
import HC_export_data from 'highcharts/modules/export-data';
import { Platform } from '@ionic/angular';

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
HC_exporting(Highcharts);
HC_export_data(Highcharts);

@Component({
  selector: 'app-counter-chart',
  templateUrl: './counter-chart.component.html',
  styleUrls: ['./counter-chart.component.scss'],
})
export class CounterChartComponent implements OnInit, OnDestroy {
  randomId: string = Math.random().toString(36).substring(2, 15);
  private destroyed$: Subject<void> = new Subject<void>();

  @Input() events: Observable<CounterEvent[]>;
  @Input() counter: Observable<Counter>;

  public options: any = {
    chart: {
      type: 'line',
      zoomType: 'x',
    },
    title: {
      text: 'Inconnu',
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter() {
        return Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x);
      },
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: 'Valeur du compteur',
      },
      allowDecimals: false,
    },
    series: [],
  };

  constructor(private platform: Platform) {}

  ngOnInit() {
    this.setExportOptions(this.options);
    this.counter.pipe(takeUntil(this.destroyed$)).subscribe(counter => {
      this.options.title.text = counter.name;
    });
    this.events.pipe(takeUntil(this.destroyed$)).subscribe(events => {
      this.options.series = [
        {
          name: 'Evénements',
          data: events.map(event => [event.timestamp, event.newValue]),
        },
      ];
      Highcharts.chart(this.randomId, this.options);
    });
  }

  private setExportOptions(options) {
    if (this.platform.is('cordova')) {
      options.exporting = { enabled: false };
    } else {
      options.exporting = {
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG', 'downloadCSV'],
          },
        },
      };
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }
}
