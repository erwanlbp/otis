import { Component, OnInit } from '@angular/core';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { EventService } from '../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-counter-events',
    templateUrl: './counter-events.page.html',
    styleUrls: ['./counter-events.page.scss'],
})
export class CounterEventsPage implements OnInit {
    counterEvents: CounterEvent[];
    counterName: string;
    noMoreData: boolean = false;

    constructor(private eventService: EventService, private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(
                switchMap(params => {
                    this.counterName = params.counterName;
                    return this.eventService.fetchChunkCounterEvents$(this.counterName, 20);
                }),
            )
            .subscribe(events => (this.counterEvents = events));
    }

    loadMore() {
        this.eventService.fetchChunkCounterEvents$(this.counterName, 20, this.counterEvents[this.counterEvents.length - 1].timestamp).subscribe(events => {
            if (!events.length) {
                this.noMoreData = true;
            }
            this.counterEvents.push(...events);
        });
    }
}
