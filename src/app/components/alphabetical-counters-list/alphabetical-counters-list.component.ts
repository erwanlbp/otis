import { Component, OnDestroy, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { CounterService } from '../../services/counter.service';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TimeCounter } from '../../interfaces/time-counter.interface';
import { TimeCounterService } from '../../services/time-counter.service';
import { TagService } from '../../services/tag.service';
import { CounterTag } from '../../interfaces/counter-tag';
import { UtilsService } from '../../services/utils.service';

interface GenericCounter {
  type: 'counter' | 'timeCounter';
  counter: Counter | TimeCounter;
  tags: string[];
}

@Component({
  selector: 'app-alphabetical-counters-list',
  templateUrl: 'alphabetical-counters-list.component.html',
  styleUrls: ['alphabetical-counters-list.component.scss'],
})
export class AlphabeticalCountersListComponent implements OnInit, OnDestroy {
  allCounters$: Subject<GenericCounter[]> = new Subject<GenericCounter[]>();
  showedCounters$: Observable<GenericCounter[]>;
  tagsSelected$: Subject<string[]> = new Subject<string[]>();

  destroyed$: Subject<void> = new Subject<void>();

  constructor(private counterService: CounterService, private timeCounterService: TimeCounterService, private tagService: TagService) {}

  ngOnInit() {
    combineLatest([
      this.counterService.fetchCounters$(),
      this.timeCounterService.fetchTimeCounters$(),
      this.tagService.fetchCountersTags$(),
    ])
      .pipe(
        map(([counters, timeCounters, countersTags]) => {
          const tagsByCounter = CounterTag.mapByCounter(countersTags);
          const genericCounters: GenericCounter[] = [];
          counters.forEach(counter => genericCounters.push({ type: 'counter', counter, tags: tagsByCounter.get(counter.name) || [] }));
          timeCounters.forEach(counter =>
            genericCounters.push({ type: 'timeCounter', counter, tags: tagsByCounter.get(counter.name) || [] }),
          );
          return genericCounters.sort((a, b) => a.counter.name.localeCompare(b.counter.name));
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe(counters => {
        this.allCounters$.next(counters);
      });

    this.showedCounters$ = combineLatest([this.allCounters$, this.tagsSelected$]).pipe(
      map(([counters, tags]) => counters.filter(counter => !tags.length || UtilsService.containsAny(tags, counter.tags))),
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }
}
