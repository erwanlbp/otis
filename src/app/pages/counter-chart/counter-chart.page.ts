import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { EventService } from '../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { Counter } from 'src/app/interfaces/counter';
import { CounterService } from 'src/app/services/counter.service';

@Component({
    selector: 'app-counter-chart-page',
    templateUrl: './counter-chart.page.html',
    styleUrls: ['./counter-chart.page.scss'],
})
export class CounterChartPage implements OnInit {

    counterEvents$: Observable<CounterEvent[]>;
    counter$: Observable<Counter>;

    constructor(
        private eventService: EventService,
        private activatedRoute: ActivatedRoute,
        private counterService: CounterService,
    ) {
    }

    ngOnInit() {
        const counterNameParam$ = this.activatedRoute.params.pipe(map(params => params.counterName));
        this.counterEvents$ = counterNameParam$.pipe(switchMap(counterName => this.eventService.fetchCounterEvents$(counterName)));
        this.counter$ = counterNameParam$.pipe(switchMap(counterName => this.counterService.fetchCounter$(counterName)));
    }
}
