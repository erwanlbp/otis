import { Component, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { CounterService } from '../../services/counter.service';
import { combineLatest, Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { map, take } from 'rxjs/operators';
import { TimeCounter } from '../../interfaces/time-counter.interface';
import { TimeCounterService } from '../../services/time-counter.service';

interface GenericCounter {
  type: 'counter' | 'timeCounter';
  counter: Counter | TimeCounter;
}

@Component({
  selector: 'app-alphabetical-counters-list',
  templateUrl: 'alphabetical-counters-list.component.html',
  styleUrls: ['alphabetical-counters-list.component.scss'],
})
export class AlphabeticalCountersListComponent implements OnInit {
  allCounters: Observable<GenericCounter[]>;

  constructor(
    private counterService: CounterService,
    private timeCounterService: TimeCounterService,
    private timeCountersService: CounterService,
    private loader: LoaderService,
  ) {}

  async ngOnInit() {
    await this.loader.showLoader('Chargement ...');

    this.allCounters = combineLatest([this.counterService.fetchCounters$(), this.timeCounterService.fetchTimeCounters$()]).pipe(
      map(([counters, timeCounters]) => {
        const genericCounters: GenericCounter[] = [];
        counters.forEach(counter => genericCounters.push({ type: 'counter', counter }));
        timeCounters.forEach(counter => genericCounters.push({ type: 'timeCounter', counter }));
        return genericCounters.sort((a, b) => a.counter.name.localeCompare(b.counter.name));
      }),
    );
    await this.allCounters.pipe(take(1)).toPromise();
    await this.loader.dismissLoader();
  }
}