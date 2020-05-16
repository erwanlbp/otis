import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { EventService } from '../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, tap } from 'rxjs/operators';
import { Counter } from 'src/app/interfaces/counter';
import { CounterService } from 'src/app/services/counter.service';
import * as _ from 'underscore';
import { DatePipe } from '@angular/common';
import { EventAggregate } from 'src/app/interfaces/event-aggregate.interface';

import * as moment from 'moment';

@Component({
    selector: 'app-counter-chart-page',
    templateUrl: './counter-chart.page.html',
    styleUrls: ['./counter-chart.page.scss'],
})
export class CounterChartPage implements OnInit {

    counterEventsDayAggregated$: Observable<EventAggregate[]>;
    counterEvents$: Observable<CounterEvent[]>;
    counter$: Observable<Counter>;

    constructor(
        private eventService: EventService,
        private activatedRoute: ActivatedRoute,
        private counterService: CounterService,
        private datePipe: DatePipe,
    ) {
    }

    ngOnInit() {
        const counterNameParam$ = this.activatedRoute.params.pipe(map(params => params.counterName));
        this.counterEvents$ = counterNameParam$.pipe(switchMap(counterName => this.eventService.fetchAllCounterEvents$(counterName)));
        this.counterEventsDayAggregated$ = counterNameParam$.pipe(
            switchMap(counterName => this.eventService.fetchAllCounterEvents$(counterName)),
            map(events => _.countBy(events, ((event: CounterEvent) => moment(event.timestamp).format('dddd')))),
            tap(x => console.log(x)),
            map(counts => Object.keys(counts).map(key => ({ label: key, value: counts[key] }))),
            tap(x => console.log(x)),
        );
        this.counter$ = counterNameParam$.pipe(switchMap(counterName => this.counterService.fetchCounter$(counterName)));
    }
}
