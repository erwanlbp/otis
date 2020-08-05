import { Component, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { CounterService } from '../../services/counter.service';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    counters: Observable<Counter[]>;

    constructor(
        private counterService: CounterService,
        private loader: LoaderService,
    ) {
    }

    ngOnInit(): void {
        this.loader.showLoader('Chargement ...')
            .then(() => {
                this.counters = this.counterService.fetchCounters$();
                this.counters.pipe(take(1)).toPromise()
                    .then(() => this.loader.dismissLoader());
            });
    }
}
