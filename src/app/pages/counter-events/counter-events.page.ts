import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { EventService } from '../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-counter-events',
    templateUrl: 'counter-events.page.html',
    styleUrls: ['counter-events.page.scss']
})
export class CounterEventsPage implements OnInit {

    counterEvents: Observable<CounterEvent[]>;
    counterName: string;

    constructor(
        private eventService: EventService,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.counterEvents = this.activatedRoute.params.pipe(
            switchMap(params => {
                this.counterName = params.counterName;
                return this.eventService.fetchCounterEvents$(this.counterName);
            })
        );
    }
}
