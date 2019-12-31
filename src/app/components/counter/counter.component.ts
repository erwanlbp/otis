import { Component, Input, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { CounterService } from '../../services/counter.service';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

    @Input() counter: Counter;

    constructor(
        private counterService: CounterService,
    ) {
    }

    ngOnInit() {
    }

    decrement() {
        this.counter.value--;
        this.counterService.saveCounter(this.counter);
    }

    increment() {
        this.counter.value++;
        this.counterService.saveCounter(this.counter);
    }
}
