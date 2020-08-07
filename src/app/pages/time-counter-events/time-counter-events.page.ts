import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TimeCounterEvent } from '../../interfaces/time-counter-event.interface';
import { TimeCounterEventService } from '../../services/time-counter-event.service';

@Component({
    selector: 'app-time-counter-events',
    templateUrl: './time-counter-events.page.html',
    styleUrls: ['./time-counter-events.page.scss'],
})
export class TimeCounterEventsPage implements OnInit {

    private static EVENTS_CHUNK_SIZE = 20;

    timeCounterEvents: TimeCounterEvent[];
    timeCounterName: string;
    noMoreData: boolean = false;

    constructor(
        private timeCounterEventService: TimeCounterEventService,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(
                switchMap(params => {
                    this.timeCounterName = params.timeCounterName;
                    return this.timeCounterEventService.fetchChunkTimeCounterEvents$(this.timeCounterName, TimeCounterEventsPage.EVENTS_CHUNK_SIZE);
                }),
            )
            .subscribe(events => {
                this.timeCounterEvents = events;
                if (!events.length || events.length < TimeCounterEventsPage.EVENTS_CHUNK_SIZE) {
                    this.noMoreData = true;
                }
            });
    }

    loadMore() {
        this.timeCounterEventService.fetchChunkTimeCounterEvents$(this.timeCounterName, TimeCounterEventsPage.EVENTS_CHUNK_SIZE, this.timeCounterEvents[this.timeCounterEvents.length - 1].startTimestamp)
            .subscribe(events => {
                if (!events.length || events.length < TimeCounterEventsPage.EVENTS_CHUNK_SIZE) {
                    this.noMoreData = true;
                }
                this.timeCounterEvents.push(...events);
            });
    }
}
