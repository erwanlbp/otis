import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { EventService } from '../../services/event.service';

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
    ) {
    }

    ngOnInit(): void {
        this.counterName = 'Events';
        this.counterEvents = this.eventService.fetchCounterEvents$(this.counterName);
    }
}
