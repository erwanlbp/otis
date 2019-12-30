import { Component, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { CounterService } from '../../services/counter.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

    counters: Observable<Counter[]>;

    constructor(
        private counterService: CounterService,
    ) {
    }

    ngOnInit(): void {
        this.counters = this.counterService.fetchCounters();
    }
}
