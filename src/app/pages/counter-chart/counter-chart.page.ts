import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { EventService } from '../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-counter-chart-page',
    templateUrl: './counter-chart.page.html',
    styleUrls: ['./counter-chart.page.scss'],
})
export class CounterChartPage implements OnInit {

    counterEvents: Observable<CounterEvent[]>;
    counterName: string;

    constructor(
        private eventService: EventService,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.counterEvents = this.activatedRoute.params.pipe(
            switchMap(params => {
                this.counterName = params.counterName;
                return this.eventService.fetchCounterEvents$(this.counterName);
            })
        );
    }
}
