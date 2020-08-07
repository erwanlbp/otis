import { Component, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { CounterService } from '../../services/counter.service';
import { forkJoin, Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { take } from 'rxjs/operators';
import { TimeCounter } from '../../interfaces/time-counter.interface';
import { TimeCounterService } from '../../services/time-counter.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    counters: Observable<Counter[]>;
    timeCounters: Observable<TimeCounter[]>;

    constructor(
        private counterService: CounterService,
        private timeCounterService: TimeCounterService,
        private timeCountersService: CounterService,
        private loader: LoaderService,
    ) {
    }

    ngOnInit(): void {
        this.loader.showLoader('Chargement ...')
            .then(() => {
                this.counters = this.counterService.fetchCounters$();
                this.timeCounters = this.timeCounterService.fetchTimeCounters$();
                forkJoin([
                    this.counters.pipe(take(1)),
                    this.timeCounters.pipe(take(1)),
                ]).toPromise()
                    .then(() => this.loader.dismissLoader());
            });
    }
}
