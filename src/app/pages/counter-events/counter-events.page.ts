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
  private static EVENTS_CHUNK_SIZE = 20;

  counterEvents: CounterEvent[];
  counterName: string;
  noMoreData: boolean = false;

  constructor(private eventService: EventService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          this.counterName = params.counterName;
          return this.eventService.fetchChunkCounterEvents$(this.counterName, CounterEventsPage.EVENTS_CHUNK_SIZE);
        }),
      )
      .subscribe(events => {
        this.counterEvents = events;
        if (!events.length || events.length < CounterEventsPage.EVENTS_CHUNK_SIZE) {
          this.noMoreData = true;
        }
      });
  }

  loadMore() {
    this.eventService
      .fetchChunkCounterEvents$(
        this.counterName,
        CounterEventsPage.EVENTS_CHUNK_SIZE,
        this.counterEvents[this.counterEvents.length - 1].timestamp,
      )
      .subscribe(events => {
        if (!events.length || events.length < CounterEventsPage.EVENTS_CHUNK_SIZE) {
          this.noMoreData = true;
        }
        this.counterEvents.push(...events);
      });
  }
}
