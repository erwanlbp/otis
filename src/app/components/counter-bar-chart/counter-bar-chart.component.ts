import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable, Subject } from 'rxjs';
import { takeUntil, count } from 'rxjs/operators';
import { Counter } from 'src/app/interfaces/counter';
import HC_exporting from 'highcharts/modules/exporting';
import Boost from 'highcharts/modules/boost';
import noData from 'highcharts/modules/no-data-to-display';
import More from 'highcharts/highcharts-more';
import HC_export_data from 'highcharts/modules/export-data';
import { Platform } from '@ionic/angular';
import { CounterEvent } from 'src/app/interfaces/counter-event.interface';
import { EventAggregate } from 'src/app/interfaces/event-aggregate.interface';

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
HC_exporting(Highcharts);
HC_export_data(Highcharts);

@Component({
  selector: 'app-counter-bar-chart',
  templateUrl: './counter-bar-chart.component.html',
  styleUrls: ['./counter-bar-chart.component.scss'],
})
export class CounterBarChartComponent implements OnInit, OnDestroy {

  randomId: string = Math.random().toString(36).substring(2, 15);
  private destroyed$: Subject<void> = new Subject<void>();

  @Input() events: Observable<EventAggregate[]>;
  @Input() counter: Observable<Counter>;
  @Input() aggregateName: string;
  @Input()

  public options: any = {
    chart: {
      type: 'column',
      zoomType: 'x',
    },
    title: {
      text: 'Inconnu'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      // formatter() {
      //     return Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x);
      // }
    },
    xAxis: {
      // type: 'date',
      allowDecimals: false,
    },
    yAxis: {
      title: {
        text: 'Somme du compteur'
      },
      allowDecimals: false,
    },
    series: [],
  };

  constructor(
    private platform: Platform,
  ) {
  }

  ngOnInit() {
    this.setExportOptions(this.options);
    this.counter.pipe(takeUntil(this.destroyed$)).subscribe(counter => {
      this.options.title.text = `Nombre d'occurences du compteur ${counter.name} par ${this.aggregateName}`;
    });
    this.events.pipe(takeUntil(this.destroyed$)).subscribe(events => {
      const datas = this.buildData(events);
      this.options.xAxis.categories = datas[0];
      this.options.series = datas[1];
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
            menuItems: [
              'downloadPNG',
              'downloadCSV',
            ]
          }
        }
      };
    }
  }

  private buildData(events: EventAggregate[]): any[][] {
    const labels = [];
    const data = [];
    events.forEach(event => {
      labels.push(event.label);
      data.push(event.value);
    });
    return [labels, [{ data, name: 'Nombre d\'événements' }]];
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }
}
